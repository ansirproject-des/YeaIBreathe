import axios from "axios";
import { DbNotification } from "../types";

export async function getNotifications() {
  const res = await axios.get<DbNotification[]>("/api/notifications");
  return res.data;
}

export async function markNotificationAsRead(notificationId: string) {
  const res = await axios.patch(
    `/api/notifications/${notificationId}/read`
  );

  return res.data;
}

export async function markAllNotificationsAsRead() {
  const res = await axios.patch("/api/notifications/read-all");

  return res.data;
}