import React from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationsContext";

interface NotificationBellProps {
  colorMode: "light" | "dark";
}

const NotificationBell: React.FC<NotificationBellProps> = ({ colorMode }) => {
  const { unreadCount, togglePanel } = useNotifications();

  return (
    <button
      onClick={togglePanel}
      className={`relative p-2 rounded-lg ${
        colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
      }`}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
