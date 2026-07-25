export function FooterLinks() {
  const links = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business"];
  return (
    <div className="text-xs text-muted-foreground px-4 space-y-1">
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {links.map((l) => (
          <a key={l} className="hover:text-primary hover:underline cursor-pointer">
            {l}
          </a>
        ))}
      </div>
      <div className="pt-3 flex items-center gap-1 font-semibold">
        <span className="h-4 w-4 rounded bg-brand text-brand-foreground grid place-items-center text-[10px]">L</span>
        LinkedOut Corporation © 2026
      </div>
    </div>
  );
}
