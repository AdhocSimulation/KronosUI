import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationItem } from "../types";

interface SidebarNavigationProps {
  colorMode: "light" | "dark";
  menuItems: NavigationItem[];
  isExpanded: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  colorMode,
  menuItems,
  isExpanded,
}) => {
  const location = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 my-1 mx-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-900 text-white"
                : colorMode === "dark"
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <Icon className={`w-5 h-5 ${!isExpanded && "mx-auto"}`} />
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
