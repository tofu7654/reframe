export type SemanticEventName =
  | "jobs_tab_opened"
  | "job_viewed"
  | "job_saved"
  | "job_applied"
  | "people_searched"
  | "profile_viewed"
  | "candidate_messaged"
  | "network_tab_opened"
  | "invitation_accepted"
  | "connection_requested"
  | "notifications_tab_opened"
  | "notification_filter_applied"
  | "composer_opened"
  | "post_published";

export type EventSurface =
  | "feed"
  | "jobs"
  | "profile"
  | "messages"
  | "network"
  | "notifications"
  | "creator";
export type EventTargetType = "job" | "profile" | "post" | "message";
export type EventMetadata = Record<string, string | number | boolean>;

export type SemanticEvent = {
  id: string;
  name: SemanticEventName;
  timestamp: string;
  sessionId: string;
  surface: EventSurface;
  targetType?: EventTargetType;
  targetId?: string;
  metadata?: EventMetadata;
};

type NewSemanticEvent = Omit<SemanticEvent, "id" | "timestamp" | "sessionId">;

const EVENTS_KEY = "reframe:events:v1";
const SESSION_KEY = "reframe:session-id:v1";
const EVENTS_CHANGED = "reframe:events-changed";
const MAX_EVENTS = 200;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const EVENT_NAMES = new Set<SemanticEventName>([
  "jobs_tab_opened",
  "job_viewed",
  "job_saved",
  "job_applied",
  "people_searched",
  "profile_viewed",
  "candidate_messaged",
  "network_tab_opened",
  "invitation_accepted",
  "connection_requested",
  "notifications_tab_opened",
  "notification_filter_applied",
  "composer_opened",
  "post_published",
]);
const EVENT_SURFACES = new Set<EventSurface>([
  "feed",
  "jobs",
  "profile",
  "messages",
  "network",
  "notifications",
  "creator",
]);

function isSemanticEvent(value: unknown): value is SemanticEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<SemanticEvent>;
  return (
    typeof event.id === "string" &&
    typeof event.name === "string" &&
    EVENT_NAMES.has(event.name as SemanticEventName) &&
    typeof event.timestamp === "string" &&
    typeof event.sessionId === "string" &&
    typeof event.surface === "string" &&
    EVENT_SURFACES.has(event.surface as EventSurface)
  );
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sessionId = createId();
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function readSemanticEvents(): SemanticEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(EVENTS_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - RETENTION_MS;
    return parsed
      .filter(isSemanticEvent)
      .filter((event) => new Date(event.timestamp).getTime() >= cutoff)
      .slice(-MAX_EVENTS);
  } catch {
    return [];
  }
}

export function recordSemanticEvent(
  input: NewSemanticEvent,
  options: { dedupeWindowMs?: number } = {},
): SemanticEvent | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const events = readSemanticEvents();
    const now = Date.now();
    const sessionId = getSessionId();
    const dedupeWindowMs = options.dedupeWindowMs ?? 0;
    const duplicate = events.some(
      (event) =>
        event.name === input.name &&
        event.targetId === input.targetId &&
        event.sessionId === sessionId &&
        now - new Date(event.timestamp).getTime() < dedupeWindowMs,
    );
    if (duplicate) return undefined;

    const event: SemanticEvent = {
      ...input,
      id: createId(),
      timestamp: new Date(now).toISOString(),
      sessionId,
    };
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify([...events, event].slice(-MAX_EVENTS)));
    window.dispatchEvent(new CustomEvent(EVENTS_CHANGED, { detail: event }));
    return event;
  } catch {
    return undefined;
  }
}

export function clearSemanticEvents() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(EVENTS_KEY);
    window.dispatchEvent(new CustomEvent(EVENTS_CHANGED));
  } catch {
    // Storage may be disabled. Tracking should never break the host product.
  }
}

export function subscribeToSemanticEvents(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENTS_CHANGED, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENTS_CHANGED, listener);
    window.removeEventListener("storage", listener);
  };
}
