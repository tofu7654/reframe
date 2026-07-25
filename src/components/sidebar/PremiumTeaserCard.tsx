export function PremiumTeaserCard() {
  return (
    <div className="bg-card rounded-lg border border-border p-4 text-xs">
      <div className="text-muted-foreground text-center leading-relaxed">
        Access exclusive tools & insights
      </div>
      <div className="flex items-center gap-2 mt-2 cursor-pointer hover:underline">
        <div className="h-4 w-4 bg-premium rounded-sm" />
        <span className="font-semibold">Try Premium for free</span>
      </div>
    </div>
  );
}
