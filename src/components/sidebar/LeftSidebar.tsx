import { ProfileMiniCard } from "./ProfileMiniCard";
import { StatsCard } from "./StatsCard";
import { PremiumTeaserCard } from "./PremiumTeaserCard";
import { ShortcutsNav } from "./ShortcutsNav";

export function LeftSidebar() {
  return (
    <aside className="space-y-2">
      <ProfileMiniCard />
      <StatsCard />
      <PremiumTeaserCard />
      <ShortcutsNav />
    </aside>
  );
}
