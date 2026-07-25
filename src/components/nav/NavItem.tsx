import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export function NavItem({
  icon: Icon,
  label,
  to,
  active,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  to?: string;
  active?: boolean;
  badge?: number;
}) {
  const className = `flex flex-col items-center justify-center px-4 min-w-[80px] h-full text-xs transition-colors ${
    active
      ? "text-foreground border-b-2 border-foreground"
      : "text-muted-foreground hover:text-foreground"
  }`;
  const content = (
    <>
      <div className="relative">
        <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
        {badge ? (
          <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
            {badge}
          </span>
        ) : null}
      </div>
      <span className="mt-1">{label}</span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }
  return <button className={className}>{content}</button>;
}
