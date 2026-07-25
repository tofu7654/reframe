import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, MessageSquare, UserPlus, MoreHorizontal } from "lucide-react";
import bannerAsset from "@/assets/mbappe_banner.avif.asset.json";
import { TopNav } from "@/components/linkedout/TopNav";
import { getPerson } from "@/lib/people-data";

export const Route = createFileRoute("/profile/$personId")({
  loader: ({ params }) => {
    const person = getPerson(params.personId);
    if (!person) throw notFound();
    return { person };
  },
  component: ProfilePage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.person.name} — LinkedOut` : "Profile — LinkedOut" },
      {
        name: "description",
        content: loaderData?.person.headline ?? "View a professional profile on LinkedOut.",
      },
      { property: "og:title", content: loaderData ? `${loaderData.person.name} — LinkedOut` : "Profile" },
      { property: "og:description", content: loaderData?.person.headline ?? "LinkedOut profile" },
      { property: "og:type", content: "profile" },
    ],
  }),
});

function ProfilePage() {
  const { person } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {person.id === "kylian-mbappe" ? (
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerAsset.url})` }}
              />
            ) : (
              <div className="h-40 bg-accent" />
            )}


            <div className="px-6 pb-6 -mt-16">
              <div className="h-32 w-32 rounded-full bg-brand text-brand-foreground border-4 border-card flex items-center justify-center font-bold text-4xl">
                {person.initials}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{person.name}</h1>
                  <p className="text-foreground mt-1">{person.headline}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {person.location} ·{" "}
                    <span className="text-brand font-medium">Contact info</span>
                  </p>
                  <p className="text-sm text-brand font-medium mt-1">
                    {person.connections} connections · {person.mutual} mutual
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Link
                  to="/messaging/$personId"
                  params={{ personId: person.id }}
                  className="px-4 py-1.5 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 flex items-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </Link>
                <button className="px-4 py-1.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/10 flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4" /> Connect
                </button>
                <button className="px-4 py-1.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-accent flex items-center gap-1.5">
                  <MoreHorizontal className="h-4 w-4" /> More
                </button>
              </div>
            </div>
          </div>

          <Section title="About">
            <p className="text-sm text-foreground whitespace-pre-line">{person.about}</p>
          </Section>

          <Section title="Experience">
            <ul className="space-y-4">
              {person.experience.map((e: { title: string; company: string; years: string }, i: number) => (
                <li key={i} className="flex gap-3">
                  <div className="h-12 w-12 rounded bg-accent shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">{e.title}</div>
                    <div className="text-sm text-foreground">{e.company}</div>
                    <div className="text-xs text-muted-foreground">{e.years}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Education">
            <ul className="space-y-4">
              {person.education.map((e: { school: string; degree: string; years: string }, i: number) => (
                <li key={i}>
                  <div className="font-semibold text-foreground">{e.school}</div>
                  <div className="text-sm text-foreground">{e.degree}</div>
                  <div className="text-xs text-muted-foreground">{e.years}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {person.skills.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full bg-accent text-sm">
                  {s}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-2">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-semibold text-foreground mb-2">People you may know</h3>
            <p className="text-sm text-muted-foreground">
              Grow your network by connecting with people in similar roles.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}
