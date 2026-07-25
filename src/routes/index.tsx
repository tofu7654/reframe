import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/linkedout/TopNav";
import { LeftSidebar } from "@/components/linkedout/LeftSidebar";
import { Feed } from "@/components/linkedout/Feed";
import { RightSidebar } from "@/components/linkedout/RightSidebar";

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
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px] gap-6">
        <div className="hidden md:block">
          <LeftSidebar />
        </div>
        <div>
          <Feed />
        </div>
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
