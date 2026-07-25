import { Search, Home, Users, Briefcase, MessageSquare, Bell, Grid3x3, ChevronDown } from "lucide-react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function NavItem({
  icon: Icon,
  label,
  to,
  active,
  badge,
}: {
  icon: typeof Home;
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

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isJobs = pathname.startsWith("/jobs");
  const isHome = pathname === "/";
  const isMessaging = pathname.startsWith("/messaging");
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-[1128px] mx-auto flex items-center h-13 px-4 gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Link to="/" className="h-8 w-8 rounded bg-brand text-brand-foreground flex items-center justify-center font-bold text-lg">
            out
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = q.trim();
              if (query) navigate({ to: "/search", search: { q: query } });
            }}
            className="relative flex-1 max-w-[280px]"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full h-9 pl-10 pr-3 rounded bg-accent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </form>
        </div>
        <nav className="flex items-stretch h-14">
          <NavItem icon={Home} label="Home" to="/" active={isHome} />
          <NavItem icon={Users} label="Network" badge={1} />
          <NavItem icon={Briefcase} label="Jobs" to="/jobs" active={isJobs} />
          <NavItem icon={MessageSquare} label="Messaging" to="/messaging" active={isMessaging} />
          <NavItem icon={Bell} label="Notifications" badge={7} />
          <div className="w-px bg-border my-2" />
          <button className="flex flex-col items-center justify-center px-4 min-w-[80px] text-xs text-muted-foreground hover:text-foreground">
            <div className="h-6 w-6 rounded-full bg-muted-foreground/30" />
            <span className="mt-1 flex items-center gap-0.5">
              Me <ChevronDown className="h-3 w-3" />
            </span>
          </button>
          <div className="w-px bg-border my-2" />
          <button className="flex flex-col items-center justify-center px-4 min-w-[80px] text-xs text-muted-foreground hover:text-foreground">
            <Grid3x3 className="h-6 w-6" />
            <span className="mt-1 flex items-center gap-0.5">
              Work <ChevronDown className="h-3 w-3" />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
