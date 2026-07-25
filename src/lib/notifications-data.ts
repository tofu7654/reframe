export type NotificationCategory = "all" | "jobs" | "mentions" | "posts";

export type Notification = {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  actor: string;
  initials: string;
  message: string;
  time: string;
  unread: boolean;
  cta?: { label: string; to?: string };
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    category: "jobs",
    actor: "LinkedOut Jobs",
    initials: "JB",
    message: "3 new jobs match your search for “Senior Frontend Engineer”.",
    time: "1h",
    unread: true,
    cta: { label: "View jobs", to: "/jobs" },
  },
  {
    id: "n-2",
    category: "mentions",
    actor: "Kylian Mbappé",
    initials: "KM",
    message: "mentioned you in a comment: “great insight on team dynamics!”",
    time: "3h",
    unread: true,
  },
  {
    id: "n-3",
    category: "posts",
    actor: "Achraf Hakimi",
    initials: "AH",
    message: "shared a post you might be interested in.",
    time: "6h",
    unread: true,
  },
  {
    id: "n-4",
    category: "jobs",
    actor: "Stripe",
    initials: "ST",
    message: "posted a new Staff Engineer role in your area.",
    time: "1d",
    unread: true,
    cta: { label: "View jobs", to: "/jobs" },
  },
  {
    id: "n-5",
    category: "posts",
    actor: "Sarah Chen",
    initials: "SC",
    message: "reacted to your recent post.",
    time: "1d",
    unread: false,
  },
  {
    id: "n-6",
    category: "mentions",
    actor: "David Okafor",
    initials: "DO",
    message: "tagged you in an article about scaling teams.",
    time: "2d",
    unread: false,
  },
  {
    id: "n-7",
    category: "posts",
    actor: "Priya Natarajan",
    initials: "PN",
    message: "started following you.",
    time: "3d",
    unread: false,
  },
];
