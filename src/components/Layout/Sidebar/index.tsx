import React from "react";
import { NavigationItem } from "../types";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  colorMode: "light" | "dark";
  menuItems: NavigationItem[];
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  colorMode,
  menuItems,
  isExpanded,
  onToggle,
}) => {
  return (
    <div
      className={`${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } border-r ${
        colorMode === "dark" ? "border-gray-700" : "border-gray-200"
      } flex flex-col`}
    >
      <SidebarHeader
        colorMode={colorMode}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      <SidebarNavigation
        colorMode={colorMode}
        menuItems={menuItems}
        isExpanded={isExpanded}
      />
      <SidebarFooter colorMode={colorMode} isExpanded={isExpanded} />
    </div>
  );
};

export default Sidebar;
