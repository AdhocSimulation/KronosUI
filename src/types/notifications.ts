export type NotificationPriority = "low" | "medium" | "high";
export type NotificationCategory = "system" | "trade" | "alert" | "news";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  link?: string;
}
