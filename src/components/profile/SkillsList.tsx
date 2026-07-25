export function SkillsList({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span key={s} className="px-3 py-1 rounded-full bg-accent text-sm">
          {s}
        </span>
      ))}
    </div>
  );
}
