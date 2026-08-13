"use client";

import Image from "next/image";
import { DbNotification, formatTimeAgo } from "@/lib/types";
import { getS3Url } from "@/lib/s3-url";
import { useTranslations } from "next-intl";


export function NotificationList({
  notifications,
  isLoading,
  error,
  onClick,
}: {
  notifications: DbNotification[];
  isLoading: boolean;
  error: unknown;
  onClick: (notification: DbNotification) => void;
}) {

  const mySpace = useTranslations("mySpace");

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-text-absent">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-text-absent">
        Failed to load notifications
      </p>
    );
  }

  if (!notifications.length) {
    return (
      <p className="py-8 text-center text-sm text-text-absent">
        No notifications yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onClick(notification)}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <div className="flex w-full items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              {notification.actor.avatar ? (
                <Image
                  src={getS3Url(notification.actor.avatar)}
                  alt={`${notification.actor.displayName}'s avatar`}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
                  {notification.actor.displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p
                className={
                  notification.isRead ? "text-text" : "text-tip"
                }
              >
                <span className="font-medium">
                  @{notification.actor.username}
                </span>{" "}
                {notification.type === "like"
                  ? mySpace("notifications.liked")
                  : notification.type === "comment"
                    ?mySpace("notifications.replied")
                    : mySpace("notifications.followed")}
              </p>

              <p className="text-sm text-text-muted">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>
          </div>

          {!notification.isRead && (
            <span className="relative block size-2 shrink-0 mr-2">
              <span
                className="
        absolute
        inset-0
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
        </div>
      ))}
    </div>
  );
}