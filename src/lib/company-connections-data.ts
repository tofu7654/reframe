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
    {
      id: "imani-foster",
      name: "Imani Foster",
      initials: "IF",
      role: "Senior Security Architect",
      mutualConnections: 5,
    },
    {
      id: "ryan-patel",
      name: "Ryan Patel",
      initials: "RP",
      role: "Platform Engineering Manager",
      mutualConnections: 3,
    },
    {
      id: "sofia-martinez",
      name: "Sofia Martinez",
      initials: "SM",
      role: "Cloud Compliance Lead",
      mutualConnections: 2,
    },
    {
      id: "ethan-wright",
      name: "Ethan Wright",
      initials: "EW",
      role: "DevSecOps Engineer",
      mutualConnections: 6,
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
    {
      id: "nina-gupta",
      name: "Nina Gupta",
      initials: "NG",
      role: "Cloud Platform Architect",
      mutualConnections: 4,
    },
    {
      id: "caleb-turner",
      name: "Caleb Turner",
      initials: "CT",
      role: "Principal DevOps Engineer",
      mutualConnections: 7,
    },
    {
      id: "olivia-bennett",
      name: "Olivia Bennett",
      initials: "OB",
      role: "Technical Program Manager",
      mutualConnections: 2,
    },
    {
      id: "victor-alvarez",
      name: "Victor Alvarez",
      initials: "VA",
      role: "Infrastructure Recruiter",
      mutualConnections: 5,
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
    {
      id: "grace-liu",
      name: "Grace Liu",
      initials: "GL",
      role: "Database Reliability Engineer",
      mutualConnections: 6,
    },
    {
      id: "miles-cooper",
      name: "Miles Cooper",
      initials: "MC",
      role: "Federal Platform Director",
      mutualConnections: 3,
    },
    {
      id: "fatima-rahman",
      name: "Fatima Rahman",
      initials: "FR",
      role: "Engineering Program Manager",
      mutualConnections: 4,
    },
    {
      id: "leo-sullivan",
      name: "Leo Sullivan",
      initials: "LS",
      role: "Senior Cloud Recruiter",
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
    {
      id: "zoe-carter",
      name: "Zoe Carter",
      initials: "ZC",
      role: "Cloud Delivery Manager",
      mutualConnections: 4,
    },
    {
      id: "andre-jackson",
      name: "Andre Jackson",
      initials: "AJ",
      role: "Senior AWS Engineer",
      mutualConnections: 3,
    },
    {
      id: "meera-desai",
      name: "Meera Desai",
      initials: "MD",
      role: "Fintech Platform Lead",
      mutualConnections: 5,
    },
    {
      id: "liam-hughes",
      name: "Liam Hughes",
      initials: "LH",
      role: "DevOps Talent Partner",
      mutualConnections: 2,
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
    {
      id: "benjamin-park",
      name: "Benjamin Park",
      initials: "BP",
      role: "Principal Reliability Engineer",
      mutualConnections: 9,
    },
    {
      id: "camila-rodriguez",
      name: "Camila Rodriguez",
      initials: "CR",
      role: "Technical Program Manager",
      mutualConnections: 5,
    },
    {
      id: "darius-coleman",
      name: "Darius Coleman",
      initials: "DC",
      role: "Fulfillment Systems Architect",
      mutualConnections: 6,
    },
    {
      id: "hannah-wu",
      name: "Hannah Wu",
      initials: "HW",
      role: "SRE Talent Partner",
      mutualConnections: 3,
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
    {
      id: "avery-johnson",
      name: "Avery Johnson",
      initials: "AJ",
      role: "Developer Productivity Lead",
      mutualConnections: 8,
    },
    {
      id: "lucas-moretti",
      name: "Lucas Moretti",
      initials: "LM",
      role: "Staff Infrastructure Engineer",
      mutualConnections: 5,
    },
    {
      id: "rachel-nguyen",
      name: "Rachel Nguyen",
      initials: "RN",
      role: "Platform Technical Recruiter",
      mutualConnections: 4,
    },
    {
      id: "malik-thomas",
      name: "Malik Thomas",
      initials: "MT",
      role: "Engineering Program Manager",
      mutualConnections: 6,
    },
  ],
};

export function getConnectionsForJob(jobId: string): CompanyConnection[] {
  return CONNECTIONS_BY_JOB_ID[jobId] ?? [];
}
