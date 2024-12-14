import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationsContext";
import { Notification } from "../../types/notification";

interface NotificationPanelProps {
  colorMode: "light" | "dark";
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ colorMode }) => {
  const {
    notifications,
    isOpen,
    togglePanel,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        togglePanel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, togglePanel]);

  const getPriorityColor = (priority: Notification["priority"]): string => {
    switch (priority) {
      case "high":
        return colorMode === "dark" ? "text-red-400" : "text-red-600";
      case "medium":
        return colorMode === "dark" ? "text-yellow-400" : "text-yellow-600";
      default:
        return colorMode === "dark" ? "text-blue-400" : "text-blue-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-0 bottom-0 w-96 ${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } shadow-lg transform transition-transform duration-300 z-50`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell
            className={`w-5 h-5 ${
              colorMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          />
          <h2
            className={`text-xl font-bold ${
              colorMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Notifications
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              colorMode === "dark"
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
            title="Mark all as read"
          >
            <CheckCheck className="w-5 h-5" />
          </button>
          <button
            onClick={togglePanel}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              colorMode === "dark"
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b ${
                colorMode === "dark" ? "border-gray-700" : "border-gray-200"
              } ${
                !notification.read
                  ? colorMode === "dark"
                    ? "bg-gray-700/50"
                    : "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={`font-medium ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center mt-2 text-xs space-x-2">
                    <span
                      className={
                        colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      {format(notification.timestamp, "MMM d, yyyy HH:mm")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        colorMode === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {notification.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        colorMode === "dark"
                          ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(notification.id)}
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      colorMode === "dark"
                        ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                    title="Clear notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
