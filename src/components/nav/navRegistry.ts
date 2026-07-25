import { Bell, Briefcase, Home, MessageSquare, Users, type LucideIcon } from "lucide-react";
import type { NavItemId } from "@/contracts/personalization";

interface NavigationDefinition {
  label: string;
  icon: LucideIcon;
  to?: "/" | "/jobs" | "/messaging";
  badge?: number;
}

export const NAV_REGISTRY: Record<NavItemId, NavigationDefinition> = {
  home: { label: "Home", icon: Home, to: "/" },
  network: { label: "Network", icon: Users, badge: 1 },
  jobs: { label: "Jobs", icon: Briefcase, to: "/jobs" },
  messaging: { label: "Messaging", icon: MessageSquare, to: "/messaging" },
  notifications: { label: "Notifications", icon: Bell, badge: 7 },
};
