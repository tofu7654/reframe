import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { NetworkSidebar } from "@/components/network/NetworkSidebar";
import { InvitationsCard } from "@/components/network/InvitationsCard";
import { SuggestionsGrid } from "@/components/network/SuggestionsGrid";

export const Route = createFileRoute("/network")({
  component: NetworkPage,
  head: () => ({
    meta: [
      { title: "My Network — LinkedOut" },
      {
        name: "description",
        content: "Manage your invitations, connections, and discover people you may know on LinkedOut.",
      },
      { property: "og:title", content: "My Network — LinkedOut" },
      { property: "og:description", content: "Invitations, connections, and suggestions in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NetworkPage() {
  return (
    <PageShell>
      <main className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <div className="hidden md:block">
          <NetworkSidebar />
        </div>
        <div className="space-y-4">
          <InvitationsCard />
          <SuggestionsGrid />
        </div>
      </main>
    </PageShell>
  );
}
