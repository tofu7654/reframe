import { Bell, Briefcase, Home, MessageSquare, Users, type LucideIcon } from "lucide-react";
import type { NavItemId } from "@/contracts/personalization";

interface NavigationDefinition {
  label: string;
  icon: LucideIcon;
  to?: "/" | "/network" | "/jobs" | "/messaging" | "/notifications";
  badge?: number;
}

export const NAV_REGISTRY: Record<NavItemId, NavigationDefinition> = {
  home: { label: "Home", icon: Home, to: "/" },
  network: { label: "Network", icon: Users, to: "/network", badge: 1 },
  jobs: { label: "Jobs", icon: Briefcase, to: "/jobs" },
  messaging: { label: "Messaging", icon: MessageSquare, to: "/messaging" },
  notifications: { label: "Notifications", icon: Bell, to: "/notifications", badge: 7 },
};
