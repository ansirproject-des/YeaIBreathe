import { mapComment, mapFeedPost } from "@/lib/post/mapper";
import { SavedItem } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/user/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookmarks = await prisma.postBookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
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
        },

        comment: {
          include: {
            user: {
              include: {
                followers: true,
              }
            },
            post: {
              select: {
                userId: true,
              },
            },
            attachments: true,
            postBookmarks: true,
            likes: true,
            _count: {
              select: {
                replies: true,
                postBookmarks: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const savedItems: SavedItem[] = bookmarks.flatMap((bookmark) => {
      if (bookmark.post) {
        return {
          type: "post" as const,
          data: mapFeedPost(bookmark.post, user.id),
          savedAt: bookmark.createdAt.toISOString(),
        };
      }

      if (bookmark.comment && !bookmark.comment.isDeleted) {
        return {
          type: "comment" as const,
          data: mapComment(
            bookmark.comment,
            user.id,
            bookmark.comment.post.userId
          ),
          savedAt: bookmark.createdAt.toISOString(),
        };
      }

      return [];
    })

    return NextResponse.json(savedItems);

  } catch (error) {
    console.error("GET_SAVED_POSTS_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch saved items" },
      { status: 500 }
    );
  }
}