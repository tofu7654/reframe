export type EducationItem = { school: string; degree: string; years: string };

export function EducationList({ items }: { items: EducationItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((e, i) => (
        <li key={i}>
          <div className="font-semibold text-foreground">{e.school}</div>
          <div className="text-sm text-foreground">{e.degree}</div>
          <div className="text-xs text-muted-foreground">{e.years}</div>
        </li>
      ))}
    </ul>
  );
}
