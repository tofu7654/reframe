import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RenderHomeSlot } from "@/components/personalization/RenderHomeSlot";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LinkedOut — Your professional network" },
      {
        name: "description",
        content:
          "LinkedOut is a professional network for jobs, news, and conversations that move your career forward.",
      },
      { property: "og:title", content: "LinkedOut — Your professional network" },
      {
        property: "og:description",
        content: "Feed, jobs, and connections for the modern professional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <PageShell>
      <main className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px] gap-6">
        <div className="hidden md:block">
          <LeftSidebar />
        </div>
        <div>
          <RenderHomeSlot slot="homeMain" />
        </div>
        <div className="hidden lg:block">
          <RenderHomeSlot slot="homeRightRail" />
        </div>
      </main>
    </PageShell>
  );
}
