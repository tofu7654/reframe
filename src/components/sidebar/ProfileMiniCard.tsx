export function ProfileMiniCard({
  name = "Mohamed Salah",
  headline = "Senior Software Engineer @ Northwind",
  location = "San Francisco, California",
  company = "Northwind Labs",
}: {
  name?: string;
  headline?: string;
  location?: string;
  company?: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="h-14 bg-gradient-to-r from-brand to-primary" />
      <div className="px-4 pb-4 -mt-8 text-center">
        <div className="h-16 w-16 rounded-full bg-muted border-4 border-card mx-auto" />
        <h2 className="mt-2 font-semibold text-base hover:underline cursor-pointer">{name}</h2>
        <p className="text-xs text-muted-foreground mt-1">{headline}</p>
        <p className="text-xs text-muted-foreground mt-1">{location}</p>
      </div>
      <div className="border-t border-border px-4 py-2 hover:bg-accent cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted" />
          <span className="text-xs font-semibold">{company}</span>
        </div>
      </div>
    </div>
  );
}
