export type Job = {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  logoInitials: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  employment: "Full-time" | "Part-time" | "Contract";
  salary: string;
  posted: string;
  applicants: number;
  connections?: number;
  promoted?: boolean;
  verified?: boolean;
  benefits: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
};

export const JOBS: Job[] = [
  {
    id: "devsecops-peregrine",
    title: "DevSecOps Engineer",
    company: "Peregrine Advisors",
    logoColor: "bg-sky-100 text-sky-700",
    logoInitials: "PA",
    location: "Washington, DC",
    workplace: "Hybrid",
    employment: "Full-time",
    salary: "$92K/yr - $139K/yr",
    posted: "3 days ago",
    applicants: 47,
    promoted: true,
    benefits: ["401(k)", "Medical", "Dental"],
    description:
      "Join Peregrine Advisors to secure critical federal cloud infrastructure. You'll partner with platform and app teams to bake security into every stage of the SDLC.",
    responsibilities: [
      "Design and maintain CI/CD pipelines with security controls baked in",
      "Automate compliance scans across AWS, GCP, and on-prem estates",
      "Lead incident response drills and post-mortems",
    ],
    qualifications: [
      "5+ years in DevOps, SRE, or security engineering",
      "Hands-on with Terraform, Kubernetes, and at least one major cloud",
      "Active US clearance or ability to obtain one",
    ],
  },
  {
    id: "devops-booz",
    title: "DevOps Engineer",
    company: "Booz Allen Hamilton",
    logoColor: "bg-cyan-200 text-slate-900",
    logoInitials: "BA",
    location: "Arlington, VA",
    workplace: "Hybrid",
    employment: "Full-time",
    salary: "$110K/yr - $160K/yr",
    posted: "1 week ago",
    applicants: 33,
    connections: 2,
    promoted: true,
    verified: true,
    benefits: ["401(k)"],
    description:
      "Booz Allen is hiring a DevOps Engineer to modernize mission-critical systems. You'll work on autonomous deployments, observability, and platform reliability.",
    responsibilities: [
      "Own the health of Kubernetes clusters across multiple environments",
      "Improve deploy velocity while keeping SLOs intact",
      "Mentor engineers on infrastructure-as-code best practices",
    ],
    qualifications: [
      "3+ years running production Kubernetes",
      "Strong scripting in Python or Go",
      "Experience with GitOps tooling (Argo, Flux)",
    ],
  },
  {
    id: "sre-workday",
    title: "Software Engineer, DBaaS — US Federal",
    company: "Workday",
    logoColor: "bg-orange-100 text-orange-600",
    logoInitials: "W",
    location: "Reston, VA",
    workplace: "Hybrid",
    employment: "Full-time",
    salary: "$145K/yr - $190K/yr",
    posted: "2 days ago",
    applicants: 88,
    verified: true,
    benefits: ["Equity", "Medical", "Unlimited PTO"],
    description:
      "Build the next generation of Workday's Database-as-a-Service platform serving federal customers with strict compliance requirements.",
    responsibilities: [
      "Design highly available Postgres and MySQL topologies",
      "Automate provisioning, patching, and failover flows",
      "Partner with security to maintain FedRAMP posture",
    ],
    qualifications: [
      "Deep experience with relational databases at scale",
      "Strong systems programming background",
      "US citizenship required for federal work",
    ],
  },
  {
    id: "midlevel-devops-motion",
    title: "Mid Level DevOps Engineer",
    company: "Motion Recruitment",
    logoColor: "bg-slate-900 text-white",
    logoInitials: "M",
    location: "Alexandria, VA",
    workplace: "Hybrid",
    employment: "Contract",
    salary: "$70/hr - $95/hr",
    posted: "5 days ago",
    applicants: 21,
    promoted: true,
    benefits: ["Vision", "401(k)"],
    description:
      "Contract role supporting a fast-growing fintech client. You'll help scale their AWS footprint and improve deployment tooling.",
    responsibilities: [
      "Manage AWS accounts with Terraform",
      "Improve CI/CD reliability and speed",
      "Handle on-call rotations for platform incidents",
    ],
    qualifications: [
      "3+ years AWS + Terraform",
      "Comfortable with Docker and Kubernetes",
      "Strong communicator across remote teams",
    ],
  },
  {
    id: "sre-amazon",
    title: "Site Reliability Engineer — One Material Handling",
    company: "Amazon",
    logoColor: "bg-orange-500 text-white",
    logoInitials: "A",
    location: "Arlington, VA",
    workplace: "On-site",
    employment: "Full-time",
    salary: "$150K/yr - $210K/yr",
    posted: "6 hours ago",
    applicants: 12,
    connections: 48,
    verified: true,
    benefits: ["Medical", "401(k)", "RSUs"],
    description:
      "Own reliability for Amazon's material handling software that powers fulfillment centers worldwide. Big scope, big scale, big impact.",
    responsibilities: [
      "Drive availability and latency improvements",
      "Lead architectural reviews for reliability",
      "Build tooling that scales operations globally",
    ],
    qualifications: [
      "5+ years SRE or systems engineering",
      "Distributed systems fundamentals",
      "Bar-raising bias for operational excellence",
    ],
  },
  {
    id: "platform-stripe",
    title: "Staff Platform Engineer",
    company: "Stripe",
    logoColor: "bg-indigo-100 text-indigo-700",
    logoInitials: "S",
    location: "Remote — US",
    workplace: "Remote",
    employment: "Full-time",
    salary: "$220K/yr - $290K/yr",
    posted: "1 day ago",
    applicants: 156,
    verified: true,
    benefits: ["Equity", "Medical", "Home office stipend"],
    description:
      "Shape the internal developer platform used by thousands of Stripe engineers. Reduce toil, accelerate shipping, and set the technical direction.",
    responsibilities: [
      "Define multi-year platform strategy",
      "Lead cross-org projects end-to-end",
      "Mentor senior and staff engineers",
    ],
    qualifications: [
      "10+ years shipping infrastructure at scale",
      "Track record of org-wide impact",
      "Excellent written communication",
    ],
  },
];

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
