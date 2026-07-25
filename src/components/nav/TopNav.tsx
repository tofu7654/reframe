import { Home, Users, Briefcase, MessageSquare, Bell, Grid3x3, ChevronDown } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { BrandLogo } from "./BrandLogo";
import { SearchBar } from "./SearchBar";
import { NavItem } from "./NavItem";

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isJobs = pathname.startsWith("/jobs");
  const isHome = pathname === "/";
  const isMessaging = pathname.startsWith("/messaging");
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-[1128px] mx-auto flex items-center h-13 px-4 gap-2">
        <div className="flex items-center gap-2 flex-1">
          <BrandLogo />
          <SearchBar />
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
