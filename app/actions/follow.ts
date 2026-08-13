"use server"

import { createNotification } from "@/lib/notification/notification";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/user/user"
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetId: string) {
  try {

    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (user.id === targetId) {
      throw new Error("You cannot follow yourself")
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetId,
        },
      }
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id
        }
      });

      revalidatePath("/my-space");
      revalidatePath("/my-space/post/[postId]", "page");

      return {
        success: true,
        following: false,
      };
    };


    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetId,
      }
    })

    await createNotification({
      targetId,
      actorId: user.id,
      type: "follow",
    });

    revalidatePath("/my-space");
    revalidatePath("/my-space/post/[postId]", "page");

    return {
      success: true,
      following: true,
    };

  } catch (error) {
    console.error("TOGGLE_FOLLOW_ERROR", error);
    return {
      success: false,
      following: false,
      error: "Failed to toggle follow"
    }
  }
}