import type { AnalyticsEvent, AnalyticsEventType } from "@/contracts/events";

const STORAGE_KEY = "reframe.events";
const STORAGE_SCHEMA_VERSION = 1;
const DEFAULT_HISTORY_LIMIT = 250;
const EVENT_TYPES: AnalyticsEventType[] = [
  "job_saved",
  "job_application_submitted",
  "jobs_route_visited",
  "recommendation_shown",
  "recommendation_accepted",
  "recommendation_dismissed",
  "manifest_applied",
  "manifest_reverted",
  "manifest_restored",
];

interface EventEnvelope {
  schemaVersion: typeof STORAGE_SCHEMA_VERSION;
  events: AnalyticsEvent[];
}

export interface EventStore {
  append(event: AnalyticsEvent): void;
  read(): AnalyticsEvent[];
  clear(): void;
}

export class LocalEventStore implements EventStore {
  constructor(
    private readonly storage: Storage,
    private readonly historyLimit = DEFAULT_HISTORY_LIMIT,
  ) {}

  append(event: AnalyticsEvent): void {
    const events = [...this.read(), event].slice(-this.historyLimit);
    const envelope: EventEnvelope = {
      schemaVersion: STORAGE_SCHEMA_VERSION,
      events,
    };
    this.storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  }

  read(): AnalyticsEvent[] {
    try {
      const rawValue = this.storage.getItem(STORAGE_KEY);
      if (!rawValue) return [];
      const envelope: unknown = JSON.parse(rawValue);
      if (!isValidEnvelope(envelope)) return [];
      return structuredClone(envelope.events);
    } catch {
      return [];
    }
  }

  clear(): void {
    this.storage.removeItem(STORAGE_KEY);
  }
}

function isValidEnvelope(value: unknown): value is EventEnvelope {
  return (
    isRecord(value) &&
    value.schemaVersion === STORAGE_SCHEMA_VERSION &&
    Array.isArray(value.events) &&
    value.events.every(isAnalyticsEvent)
  );
}

function isAnalyticsEvent(value: unknown): value is AnalyticsEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.occurredAt === "string" &&
    typeof value.type === "string" &&
    EVENT_TYPES.includes(value.type as AnalyticsEventType)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
