export function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}
