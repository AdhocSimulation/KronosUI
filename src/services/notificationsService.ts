import {
  Notification,
  NotificationPriority,
  NotificationCategory,
} from "../types/notification";

type NotificationCallback = (notification: Notification) => void;

class NotificationsService {
  private subscribers: NotificationCallback[] = [];
  private mockNotifications: Notification[] = [];
  private mockInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize with some mock notifications
    this.mockNotifications = this.generateMockNotifications();
    this.startMockUpdates();
  }

  private generateMockNotifications(): Notification[] {
    const categories: NotificationCategory[] = [
      "system",
      "trade",
      "alert",
      "news",
    ];
    const priorities: NotificationPriority[] = ["low", "medium", "high"];

    return Array.from({ length: 5 }, (_, i) => ({
      id: `notification-${i}`,
      title: `Test Notification ${i + 1}`,
      message: `This is a test notification message ${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000),
      read: false,
      priority: priorities[i % priorities.length],
      category: categories[i % categories.length],
    }));
  }

  private startMockUpdates() {
    // Simulate real-time updates every 30 seconds
    this.mockInterval = setInterval(() => {
      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        title: "New Update",
        message: "This is a real-time notification update",
        timestamp: new Date(),
        read: false,
        priority: Math.random() > 0.5 ? "high" : "medium",
        category: "system",
      };

      this.mockNotifications.unshift(newNotification);
      this.notifySubscribers(newNotification);
    }, 30000);
  }

  async getNotifications(): Promise<Notification[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...this.mockNotifications];
  }

  async markAsRead(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.mockNotifications = this.mockNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  async markAllAsRead(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.mockNotifications = this.mockNotifications.map((n) => ({
      ...n,
      read: true,
    }));
  }

  async deleteNotification(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.mockNotifications = this.mockNotifications.filter((n) => n.id !== id);
  }

  subscribeToNotifications(callback: NotificationCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
      if (this.mockInterval) {
        clearInterval(this.mockInterval);
      }
    };
  }

  private notifySubscribers(notification: Notification) {
    this.subscribers.forEach((callback) => callback(notification));
  }
}

export const notificationsService = new NotificationsService();
