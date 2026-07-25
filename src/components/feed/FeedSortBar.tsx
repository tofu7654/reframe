export function FeedSortBar() {
  return (
    <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
      <div className="flex-1 border-t border-border" />
      Sort by: <span className="font-semibold text-foreground">Top ▾</span>
    </div>
  );
}
