export type PostData = {
  id: string;
  name: string;
  headline: string;
  time: string;
  content: string;
  reactions: number;
  comments: number;
  imageUrl?: string;
};

export const INITIAL_POSTS: PostData[] = [
  {
    id: "1",
    name: "Priya Ramesh",
    headline: "DevOps & Cloud Engineer | AI-Driven Operations",
    time: "1d",
    content: `The biggest misconception about MLOps...\n\nPeople think the career path looks like this:\nData → Model → Deploy → Done.\n\nIn reality: it's a loop. Monitor, retrain, ship, repeat. The teams that treat models like living products win.`,
    reactions: 1284,
    comments: 92,
  },
  {
    id: "2",
    name: "Marcus Lee",
    headline: "Product Designer @ Studio Nomad",
    time: "4h",
    content: `Design systems don't fail because of tokens.\n\nThey fail because no one owns the handoff between design and engineering. Fix the seam, not the file.`,
    reactions: 412,
    comments: 38,
  },
  {
    id: "3",
    name: "Sofia Alvarez",
    headline: "Founder & CEO at Northwind Labs",
    time: "2d",
    content: `Hiring update: we just closed our Series A and we're bringing on 12 engineers this quarter.\n\nIf you care about developer experience and want to build tools that thousands of teams use daily — send me a note.`,
    reactions: 3204,
    comments: 187,
  },
];
