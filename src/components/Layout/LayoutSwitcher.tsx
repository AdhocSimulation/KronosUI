import React, { useState } from "react";
import { Layout, Sun, Moon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar/index"; // Update import to use new modular Sidebar
import TopNavbar from "./TopNavbar";
import NotificationPanel from "../Notifications/NotificationPanel";
import { NavigationItem } from "./types";

interface LayoutSwitcherProps {
  colorMode: "light" | "dark";
  menuItems: NavigationItem[];
  onColorModeToggle: () => void;
  children: React.ReactNode;
}

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  colorMode,
  menuItems,
  onColorModeToggle,
  children,
}) => {
  const [useSidebar, setUseSidebar] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { isAuthenticated } = useAuth();

  // Filter menu items based on authentication
  const filteredMenuItems = menuItems.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  return (
    <div className="min-h-screen">
      {/* Layout Toggle Button */}
      <button
        onClick={() => setUseSidebar(!useSidebar)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 ${
          colorMode === "dark"
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-50 text-gray-900"
        }`}
        title="Toggle Layout"
      >
        <Layout className="w-5 h-5" />
      </button>

      {/* Color Mode Toggle Button */}
      <button
        onClick={onColorModeToggle}
        className={`fixed bottom-4 right-20 p-3 rounded-full shadow-lg z-50 ${
          colorMode === "dark"
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
            : "bg-white hover:bg-gray-50 text-gray-900"
        }`}
        aria-label="Toggle color mode"
      >
        {colorMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {useSidebar ? (
        <div className="flex min-h-screen">
          <Sidebar
            colorMode={colorMode}
            menuItems={filteredMenuItems}
            isExpanded={isSidebarExpanded}
            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
          <div
            className={`flex-1 transition-all duration-300 ${
              isSidebarExpanded ? "ml-64" : "ml-16"
            }`}
          >
            {children}
          </div>
        </div>
      ) : (
        <>
          <TopNavbar
            colorMode={colorMode}
            menuItems={filteredMenuItems}
            onColorModeToggle={onColorModeToggle}
          />
          <div className="pt-16">{children}</div>
        </>
      )}

      {/* Notification Panel */}
      {isAuthenticated && <NotificationPanel colorMode={colorMode} />}
    </div>
  );
};

export default LayoutSwitcher;
