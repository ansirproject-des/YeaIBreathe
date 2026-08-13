import { prisma } from "../prisma";
import { NotificationType } from "@/app/generated/prisma/enums";
import { getCurrentDbUser } from "../user/user";
import { mapNotification } from "../post/mapper";

type createNotificationParams = {
  targetId: string,
  actorId: string,
  type: NotificationType,
  postId?: string,
  commentId?: string,
}

export async function createNotification({
  targetId,
  actorId,
  type,
  postId,
  commentId,
}: createNotificationParams) {
  try {
    if (targetId === actorId) return null;

    return prisma.notification.create({
      data: {
        targetId,
        actorId,
        type,
        postId: postId ?? null,
        commentId: commentId ?? null,
        isRead: false,
      }
    })

  } catch (error) {
    console.error("", error)
  }
}

export async function getNotifications() {
  try {

    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const notifications  = await prisma.notification.findMany({
      where: {
        targetId: user.id
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    })

    return notifications.map(mapNotification)

  } catch (error) {
    console.error("GET_NOTIFICATIONS_ERROR", error)
  }
}
