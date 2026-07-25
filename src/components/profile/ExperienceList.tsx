export type ExperienceItem = { title: string; company: string; years: string };

export function ExperienceList({ items }: { items: ExperienceItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((e, i) => (
        <li key={i} className="flex gap-3">
          <div className="h-12 w-12 rounded bg-accent shrink-0" />
          <div>
            <div className="font-semibold text-foreground">{e.title}</div>
            <div className="text-sm text-foreground">{e.company}</div>
            <div className="text-xs text-muted-foreground">{e.years}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
