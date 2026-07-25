export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  at: number;
};

const KEY_PREFIX = "linkedout:chat:";

export function loadMessages(personId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + personId);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(personId: string, msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_PREFIX + personId, JSON.stringify(msgs));
}

export function listThreads(): string[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) ids.push(k.slice(KEY_PREFIX.length));
  }
  return ids;
}

export function autoReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("hi") || t.includes("hello") || t.includes("hey")) {
    return "Hey! Thanks for reaching out. Great to connect.";
  }
  if (t.includes("opportunity") || t.includes("role") || t.includes("job") || t.includes("position")) {
    return "Sounds interesting — could you share a bit more about the role and timeline?";
  }
  if (t.includes("thanks") || t.includes("thank you")) {
    return "Anytime! Talk soon.";
  }
  return "Merci for the message! I'll get back to you shortly.";
}
