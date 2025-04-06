import {
  BarChart2,
  Home,
  Info,
  Briefcase,
  Code,
  Calendar,
  LayoutDashboard,
  Activity,
  Database,
  LineChart,
} from "lucide-react";
import { NavigationItem } from "./types";

export const getNavigationItems = (): NavigationItem[] => [
  { path: "/", label: "Home", icon: Home },
  { path: "/chart", label: "Live Chart", icon: BarChart2, requireAuth: true },
  {
    path: "/portfolios",
    label: "Portfolios",
    icon: Briefcase,
    requireAuth: true,
  },
  {
    path: "/strategy-builder",
    label: "Strategy Builder",
    icon: Code,
    requireAuth: true,
  },
  {
    path: "/events",
    label: "Events",
    icon: Calendar,
    requireAuth: true,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
  },
  {
    path: "/workflows",
    label: "Workflows",
    icon: Database,
    requireAuth: true,
  },
  {
    path: "/monitoring",
    label: "Monitoring",
    icon: Activity,
    requireAuth: true,
  },
  {
    path: "/research",
    label: "Research",
    icon: LineChart,
    requireAuth: true,
  },
  { path: "/about", label: "About", icon: Info },
];
