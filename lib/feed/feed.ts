import { mapFeedPost } from "../post/mapper";
import { prisma } from "../prisma";

export async function getFeed(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: userId
        },
        OR: [
          {
            visibility: "anyone"
          },
          {
            visibility: "followers_only",
            user: {
              followers: {
                some: {
                  followerId: userId,
                }
              }
            }
          }
        ]
      },
      include: {
        attachments: true,
        user: {
          include: {
            followers: true
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
      take: 20,
    })

    return posts.map((post) => (
      mapFeedPost(post, userId)
    ))
  } catch (error) {
    console.error("GET_FEED_POSTS_ERROR", error)
    throw error;
  }
}