import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { Prisma } from "@/app/generated/prisma/client";

export async function getCurrentDbUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("User is not authenticated.");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    include: {
    links: {
      orderBy: {
        order: "asc",
      },
    },
    _count: {
    select: {
      followers: true,
    },
  },
  },
  });

  if (!user) {
    throw new Error("Database user not found.");
  }

  return user;
}

export async function getUserByUsername(username: string) {
  const currentUser = await getCurrentDbUser();

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      links: {
        orderBy: {
          order: "asc",
        },
      },

      _count: {
        select: {
          followers: true,
          posts: true,
        },
      },

      followers: {
        where: {
          followerId: currentUser.id
        },
        select: {
          followerId: true,
        },
      },
    },
  });

  if (!user) {
    return null
  }

  return {
    ...user,
    isOwner: user.id === currentUser.id,
    isFollowing: user.followers.length > 0,
    followersCount: user._count.followers,
    postsCount: user._count.posts,
  }
}

export async function getPublicProfilePosts(userId: string) {
  const currentUser = await getCurrentDbUser();

  const isOwner = currentUser.id === userId;

  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: userId,
      }
    },
  });

  const canSeeFollowersPosts = isOwner || !!isFollowing;

  const visibilityConditions: Prisma.PostWhereInput[] = [
    {
      visibility: "anyone",
    },
  ];

  if (canSeeFollowersPosts) {
    visibilityConditions.push({
      visibility: "followers_only",
    });
  }

  return prisma.post.findMany({
    where: {
      userId,
      authorType: "public",
      OR: visibilityConditions,
    },

    include: {
      user: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}