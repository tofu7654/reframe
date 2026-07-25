export type CompanyConnection = {
  id: string;
  name: string;
  initials: string;
  role: string;
  mutualConnections: number;
};

const CONNECTIONS_BY_JOB_ID: Record<string, CompanyConnection[]> = {
  "devsecops-peregrine": [
    {
      id: "maya-thompson",
      name: "Maya Thompson",
      initials: "MT",
      role: "Cloud Security Engineer",
      mutualConnections: 4,
    },
    {
      id: "daniel-cho",
      name: "Daniel Cho",
      initials: "DC",
      role: "Technical Recruiter",
      mutualConnections: 2,
    },
  ],
  "devops-booz": [
    {
      id: "aisha-williams",
      name: "Aisha Williams",
      initials: "AW",
      role: "Lead DevOps Engineer",
      mutualConnections: 6,
    },
    {
      id: "marcus-reed",
      name: "Marcus Reed",
      initials: "MR",
      role: "Engineering Manager",
      mutualConnections: 3,
    },
  ],
  "sre-workday": [
    {
      id: "elena-garcia",
      name: "Elena Garcia",
      initials: "EG",
      role: "Staff Database Engineer",
      mutualConnections: 5,
    },
    {
      id: "noah-kim",
      name: "Noah Kim",
      initials: "NK",
      role: "Talent Acquisition Partner",
      mutualConnections: 2,
    },
  ],
  "midlevel-devops-motion": [
    {
      id: "priya-shah",
      name: "Priya Shah",
      initials: "PS",
      role: "DevOps Practice Lead",
      mutualConnections: 3,
    },
    {
      id: "owen-brooks",
      name: "Owen Brooks",
      initials: "OB",
      role: "Technical Recruiter",
      mutualConnections: 1,
    },
  ],
  "sre-amazon": [
    {
      id: "jordan-mitchell",
      name: "Jordan Mitchell",
      initials: "JM",
      role: "Senior Site Reliability Engineer",
      mutualConnections: 8,
    },
    {
      id: "leila-hassan",
      name: "Leila Hassan",
      initials: "LH",
      role: "Software Development Manager",
      mutualConnections: 4,
    },
  ],
  "platform-stripe": [
    {
      id: "samantha-lee",
      name: "Samantha Lee",
      initials: "SL",
      role: "Staff Platform Engineer",
      mutualConnections: 7,
    },
    {
      id: "james-okafor",
      name: "James Okafor",
      initials: "JO",
      role: "Engineering Manager, Infrastructure",
      mutualConnections: 3,
    },
  ],
};

export function getConnectionsForJob(jobId: string): CompanyConnection[] {
  return CONNECTIONS_BY_JOB_ID[jobId] ?? [];
}
