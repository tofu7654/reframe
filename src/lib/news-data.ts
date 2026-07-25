export type NewsStory = { title: string; meta: string };
export type PersonSuggestion = { name: string; headline: string };

export const NEWS_STORIES: NewsStory[] = [
  { title: "Paramount pauses Warner deal", meta: "4h ago · 3,640 readers" },
  { title: "Lawsuit challenges new housing rule", meta: "2h ago · 3,038 readers" },
  { title: "Firms struggle to replace retiring workforce", meta: "4h ago · 1,082 readers" },
  { title: "Ultraluxury executive perks scrutinized", meta: "4m ago · 813 readers" },
  { title: "Tunneling startup eyes $20B valuation", meta: "1h ago · 657 readers" },
];

export const PEOPLE_SUGGESTIONS: PersonSuggestion[] = [
  { name: "Jordan Blake", headline: "Engineering Manager · ex-Stripe" },
  { name: "Nina Okafor", headline: "AI Researcher @ DeepGrid" },
  { name: "Ravi Patel", headline: "Staff SRE · Cloud Infrastructure" },
];
