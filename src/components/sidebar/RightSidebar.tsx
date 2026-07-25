import { NewsCard } from "./NewsCard";
import { SuggestionsCard } from "./SuggestionsCard";
import { FooterLinks } from "./FooterLinks";

export function RightSidebar() {
  return (
    <aside className="space-y-2">
      <NewsCard />
      <SuggestionsCard />
      <FooterLinks />
    </aside>
  );
}
