export function StatsCard({
  viewers = 142,
  impressions = 1204,
}: {
  viewers?: number;
  impressions?: number;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 text-xs">
      <div className="space-y-2">
        <div className="flex items-center justify-between hover:bg-accent -mx-2 px-2 py-1 rounded cursor-pointer">
          <span className="text-muted-foreground">Profile viewers</span>
          <span className="font-semibold text-primary">{viewers}</span>
        </div>
        <div className="flex items-center justify-between hover:bg-accent -mx-2 px-2 py-1 rounded cursor-pointer">
          <span className="text-muted-foreground">Post impressions</span>
          <span className="font-semibold text-primary">{impressions.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
