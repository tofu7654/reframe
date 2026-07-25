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
  {
    id: "achraf-hakimi",
    name: "Achraf Hakimi",
    headline: "Professional Footballer at Paris Saint-Germain | Right-Back | Morocco National Team",
    location: "Paris, Île-de-France, France",
    about:
      "Right-back for Paris Saint-Germain and the Morocco national team. Focused on attacking full-back play, endurance, and community initiatives across Morocco and France. Open to partnerships and mentorship opportunities.",
    currentRole: { title: "Right-Back", company: "Paris Saint-Germain", years: "2021 - Present" },
    experience: [
      { title: "Right-Back", company: "Paris Saint-Germain", years: "2021 - Present" },
      { title: "Right-Back", company: "Inter Milan", years: "2020 - 2021" },
      { title: "Right-Back (loan)", company: "Borussia Dortmund", years: "2018 - 2020" },
      { title: "Right-Back", company: "Real Madrid C.F.", years: "2017 - 2020" },
    ],
    education: [
      { school: "Real Madrid Academy (La Fábrica)", degree: "Football Academy", years: "2011 - 2017" },
    ],
    skills: ["Sprint Speed", "Crossing", "Stamina", "Overlapping Runs", "Defending", "Team Play"],
    connections: "500+",
    mutual: 8,
    initials: "AH",
    keywords: ["footballer", "football", "soccer", "right-back", "defender", "fullback", "athlete", "sports", "psg", "paris saint-germain", "morocco"],
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
