export type Person = {
  id: string;
  name: string;
  headline: string;
  location: string;
  about: string;
  currentRole: { title: string; company: string; years: string };
  experience: { title: string; company: string; years: string }[];
  education: { school: string; degree: string; years: string }[];
  skills: string[];
  connections: string;
  mutual: number;
  initials: string;
  keywords: string[];
};

export const PEOPLE: Person[] = [
  {
    id: "kylian-mbappe",
    name: "Kylian Mbappé",
    headline: "Professional Footballer at Real Madrid | Forward | Captain of France",
    location: "Madrid, Community of Madrid, Spain",
    about:
      "Forward for Real Madrid and captain of the French national team. Passionate about performance, leadership, and mentoring the next generation of athletes. Open to speaking engagements and brand partnerships.",
    currentRole: { title: "Forward", company: "Real Madrid C.F.", years: "2024 - Present" },
    experience: [
      { title: "Forward", company: "Real Madrid C.F.", years: "2024 - Present" },
      { title: "Forward & Captain", company: "Paris Saint-Germain", years: "2017 - 2024" },
      { title: "Forward", company: "AS Monaco", years: "2015 - 2017" },
    ],
    education: [
      { school: "INF Clairefontaine", degree: "Football Academy", years: "2011 - 2013" },
    ],
    skills: ["Striking", "Sprint Speed", "Leadership", "Team Play", "Finishing", "Dribbling"],
    connections: "500+",
    mutual: 12,
    initials: "KM",
    keywords: ["footballer", "football", "soccer", "forward", "striker", "athlete", "sports", "real madrid", "france"],
  },
];

export function searchPeople(query: string): Person[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PEOPLE.filter((p) => {
    const hay = [p.name, p.headline, p.currentRole.title, p.currentRole.company, ...p.keywords]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).some((token) => hay.includes(token));
  });
}

export function getPerson(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id);
}
