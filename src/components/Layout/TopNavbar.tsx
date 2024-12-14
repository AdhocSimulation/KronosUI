import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";
import { NavigationItem } from "./types";

interface TopNavbarProps {
  colorMode: "light" | "dark";
  menuItems: NavigationItem[];
  onColorModeToggle: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  colorMode,
  menuItems,
  onColorModeToggle,
}) => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav
      className={`${
        colorMode === "dark"
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-800"
      } shadow-md fixed top-0 left-0 right-0 z-10 w-full`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl flex items-center">
              Kronos
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map(
                (item) =>
                  (!item.requireAuth || isAuthenticated) && (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.path
                          ? "bg-gray-900 text-white"
                          : colorMode === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-1" />
                      {item.label}
                    </Link>
                  )
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && <NotificationBell colorMode={colorMode} />}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  colorMode === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/login"
                    ? "bg-gray-900 text-white"
                    : colorMode === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
