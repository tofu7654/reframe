export function PremiumPromo() {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-base">The average career is 42 years.</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Invest in long-term growth with Premium.
        </p>
        <button className="mt-3 px-4 py-1.5 rounded-full bg-premium text-foreground font-semibold text-sm hover:brightness-95">
          Get Premium now
        </button>
      </div>
      <div className="h-20 w-20 rounded-full bg-muted shrink-0" />
    </div>
  );
}
