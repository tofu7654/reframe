export type PostEngager = {
  id: string;
  name: string;
  initials: string;
  headline: string;
  engagement: "Commented" | "Reposted" | "Reacted";
  mutualConnections: number;
};

export const POST_ENGAGERS: PostEngager[] = [
  {
    id: "nadia-clarke",
    name: "Nadia Clarke",
    initials: "NC",
    headline: "Product Marketing Lead",
    engagement: "Commented",
    mutualConnections: 5,
  },
  {
    id: "theo-martin",
    name: "Theo Martin",
    initials: "TM",
    headline: "Founder · Developer Tools",
    engagement: "Reposted",
    mutualConnections: 2,
  },
  {
    id: "iman-rahman",
    name: "Iman Rahman",
    initials: "IR",
    headline: "Engineering Manager",
    engagement: "Reacted",
    mutualConnections: 7,
  },
];
