const TABS = ["People", "Jobs", "Companies", "Posts"];

export function SearchTabs({ active = "People" }: { active?: string }) {
  return (
    <div className="mb-4 flex gap-2 text-sm">
      {TABS.map((tab) => (
        <span
          key={tab}
          className={
            tab === active
              ? "px-3 py-1 rounded-full bg-foreground text-background"
              : "px-3 py-1 rounded-full border border-border text-muted-foreground"
          }
        >
          {tab}
        </span>
      ))}
    </div>
  );
}
