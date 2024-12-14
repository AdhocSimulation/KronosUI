import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
  requireAuth?: boolean;
}
