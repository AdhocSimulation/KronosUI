import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "../types/notification";
import { notificationsService } from "../services/notificationsService";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  togglePanel: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const initialNotifications =
        await notificationsService.getNotifications();
      setNotifications(initialNotifications);
    };

    fetchNotifications();

    // Set up real-time updates
    const unsubscribe = notificationsService.subscribeToNotifications(
      (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      }
    );

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const togglePanel = () => setIsOpen(!isOpen);

  const markAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = async (id: string) => {
    await notificationsService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        togglePanel,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
