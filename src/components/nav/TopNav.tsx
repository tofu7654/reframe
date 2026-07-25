import { Grid3x3, ChevronDown } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { BrandLogo } from "./BrandLogo";
import { SearchBar } from "./SearchBar";
import { NavItem } from "./NavItem";
import { NAV_REGISTRY } from "./navRegistry";
import { usePersonalization } from "@/personalization/PersonalizationContext";

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { manifest } = usePersonalization();

  const isActive = (to?: string) => {
    if (!to) return false;
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-[1128px] mx-auto flex items-center h-13 px-4 gap-2">
        <div className="flex items-center gap-2 flex-1">
          <BrandLogo />
          <SearchBar />
        </div>
        <nav className="flex items-stretch h-14">
          {manifest.navigation.map((navItemId) => {
            const item = NAV_REGISTRY[navItemId];
            const active = isActive(item.to);
            return (
              <NavItem
                key={navItemId}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={active}
                badge={active ? undefined : item.badge}
              />
            );
          })}
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
