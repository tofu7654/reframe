export type Invitation = {
  id: string;
  name: string;
  headline: string;
  initials: string;
  mutual: number;
  sentAt: string;
};

export type Suggestion = {
  id: string;
  name: string;
  headline: string;
  initials: string;
  mutual: number;
  personId?: string;
};

export const INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    name: "Sarah Chen",
    headline: "Senior Recruiter at Meta",
    initials: "SC",
    mutual: 14,
    sentAt: "2d",
  },
  {
    id: "inv-2",
    name: "David Okafor",
    headline: "Engineering Manager at Stripe",
    initials: "DO",
    mutual: 6,
    sentAt: "5d",
  },
  {
    id: "inv-3",
    name: "Priya Natarajan",
    headline: "Product Designer • ex-Airbnb",
    initials: "PN",
    mutual: 22,
    sentAt: "1w",
  },
];

export const SUGGESTIONS: Suggestion[] = [
  {
    id: "sug-1",
    name: "Kylian Mbappé",
    headline: "Forward at Real Madrid",
    initials: "KM",
    mutual: 12,
    personId: "kylian-mbappe",
  },
  {
    id: "sug-2",
    name: "Achraf Hakimi",
    headline: "Right-Back at Paris Saint-Germain",
    initials: "AH",
    mutual: 8,
    personId: "achraf-hakimi",
  },
  {
    id: "sug-3",
    name: "Jordan Blake",
    headline: "DevOps Engineer at Amazon",
    initials: "JB",
    mutual: 4,
  },
  {
    id: "sug-4",
    name: "Emily Ruiz",
    headline: "Frontend Engineer at Vercel",
    initials: "ER",
    mutual: 9,
  },
  {
    id: "sug-5",
    name: "Marcus Lee",
    headline: "Data Scientist at Netflix",
    initials: "ML",
    mutual: 3,
  },
  {
    id: "sug-6",
    name: "Ana Costa",
    headline: "Product Manager at Figma",
    initials: "AC",
    mutual: 17,
  },
];

export const NETWORK_STATS = {
  connections: 486,
  following: 132,
  groups: 8,
  events: 3,
  pages: 24,
  newsletters: 5,
};
