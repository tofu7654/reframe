import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { getPerson } from "@/lib/people-data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ExperienceList } from "@/components/profile/ExperienceList";
import { EducationList } from "@/components/profile/EducationList";
import { SkillsList } from "@/components/profile/SkillsList";
import { PeopleYouMayKnowCard } from "@/components/profile/PeopleYouMayKnowCard";

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
    <PageShell>
      <div className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-2">
          <ProfileHeader person={person} />
          <ProfileSection title="About">
            <p className="text-sm text-foreground whitespace-pre-line">{person.about}</p>
          </ProfileSection>
          <ProfileSection title="Experience">
            <ExperienceList items={person.experience} />
          </ProfileSection>
          <ProfileSection title="Education">
            <EducationList items={person.education} />
          </ProfileSection>
          <ProfileSection title="Skills">
            <SkillsList skills={person.skills} />
          </ProfileSection>
        </div>
        <aside className="space-y-2">
          <PeopleYouMayKnowCard />
        </aside>
      </div>
    </PageShell>
  );
}
