import { prisma } from "../prisma";
import { getCurrentDbUser } from "../user/user";
import { mapFeedPost, mapPostDetails } from "./mapper";
import { DbPost } from "../types";


export async function getPostById(id: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
        user: {
          include: {
            followers: true,
          }
        },
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            comments: true,
            postBookmarks: true,
          },
        },
      }
    });

    if (!post) {
      console.error("No post is found");
      return null;
    }

    return mapPostDetails(post, user.id);

  } catch (error) {
    console.error("GET_POST_ERROR", error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    };

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id
      },
      include: {
        attachments: true,
        user: {
          include: {
            followers: true,
          }
        },
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            comments: true,
            postBookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    const dbPosts: DbPost[] = posts.map((post) =>
      mapFeedPost(post, user.id)
    );

    return dbPosts;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
}

export async function getSavedPosts(): Promise<DbPost[]> {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const posts = await prisma.post.findMany({
      where: {
        postBookmarks: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        attachments: true,
        user: {
          include: {
            followers: true,
          }
        },
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            comments: true,
            postBookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post) =>
      mapFeedPost(post, user.id)
    );
  } catch (error) {
    console.error("GET_SAVED_POSTS_ERROR", error);
    throw error;
  }
}