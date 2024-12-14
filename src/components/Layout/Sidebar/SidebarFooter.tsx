import React from "react";
import { Link } from "react-router-dom";
import { LogOut, LogIn } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import NotificationBell from "../../Notifications/NotificationBell";

interface SidebarFooterProps {
  colorMode: "light" | "dark";
  isExpanded: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  colorMode,
  isExpanded,
}) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div
      className={`p-4 border-t ${
        colorMode === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {isAuthenticated ? (
        <div
          className={`flex ${
            isExpanded ? "justify-between" : "justify-center"
          } items-center`}
        >
          {!isExpanded ? (
            <div className="flex flex-col space-y-4 items-center">
              <NotificationBell colorMode={colorMode} />
              <button
                onClick={logout}
                className={`p-2 rounded-lg ${
                  colorMode === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={logout}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  colorMode === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              <NotificationBell colorMode={colorMode} />
            </>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            colorMode === "dark"
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          } ${!isExpanded && "justify-center w-full"}`}
        >
          <LogIn className="w-5 h-5" />
          {isExpanded && <span>Login</span>}
        </Link>
      )}
    </div>
  );
};

export default SidebarFooter;
