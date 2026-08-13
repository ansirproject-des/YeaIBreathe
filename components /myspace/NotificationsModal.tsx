"use client";

import { Bell } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notification";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { ModalTrigger } from "../ui/ModalTrigger";
import { NotificationList } from "./NotificationList";
import { useTranslations } from "next-intl";

export function NotificationsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const mySpace = useTranslations("mySpace");

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  const handleNotificationClick = async (
    notification: (typeof notifications)[number]
  ) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);

        queryClient.setQueryData(
          ["notifications"],
          notifications.map((item) =>
            item.id === notification.id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      switch (notification.type) {
        case "like":
          router.push(`/my-space/post/${notification.postId}`);
          break;

        case "comment":
          router.push(
            `/my-space/post/${notification.postId}?comment=${notification.commentId}`
          );
          break;

        case "follow":
          router.push(`/user/${notification.actor.username}`);
          break;
      }

      setIsOpen(false);
    } catch (error) {
      console.error(
        "Failed to handle notification:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      queryClient.setQueryData(
        ["notifications"],
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const notificationContent = (
    <>
      <div className="flex items-center justify-between border-b border-surface py-3">
        <h3 className="font-medium px-4">{mySpace("notifications.label")}</h3>

        {hasUnreadNotifications && (
          <Button
            size="sm"
            variant="secondaryGray"
            onClick={handleMarkAllAsRead}
          >
            {mySpace("notifications.markAsRead")}
          </Button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto sm:px-4 py-8 hide-scrollbar">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          error={error}
          onClick={handleNotificationClick}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="relative hidden sm:block">
        <IconButton
          size="sm"
          variant="text"
          aria-label="Notifications"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="relative inline-flex">
            <Bell className="size-5" />

            {hasUnreadNotifications && (
              <span className="absolute -right-0.5 -bottom-0.5 overflow-visible">
                <span
                  className="
                    absolute
                    left-0
                    top-0
                    size-2
                    rounded-full
                    bg-tip
                    animate-helper-pulse
                  "
                />

                <span
                  className="
                    relative
                    block
                    size-2
                    rounded-full
                    bg-tip
                  "
                />
              </span>
            )}
          </span>
        </IconButton>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-100 rounded-2xl border border-surface bg-app-bg/72 shadow-sm backdrop-blur-xs">
            {notificationContent}
          </div>
        )}
      </div>


      <div className="sm:hidden">
        <ModalTrigger
          trigger={(open) => (
            <IconButton
              size="sm"
              variant="text"
              aria-label="Notifications"
              onClick={open}
            >
              <span className="relative inline-flex">
                <Bell className="size-5" />

                {hasUnreadNotifications && (
                  <span className="absolute -right-0.5 -bottom-0.5 overflow-visible">
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        size-2
                        rounded-full
                        bg-tip
                        animate-helper-pulse
                      "
                    />

                    <span
                      className="
                        relative
                        block
                        size-2
                        rounded-full
                        bg-tip
                      "
                    />
                  </span>
                )}
              </span>
            </IconButton>
          )}
        >
          {() => notificationContent}
        </ModalTrigger>
      </div>
    </>
  );
}