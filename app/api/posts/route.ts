import { mapFeedPost, } from "@/lib/post/mapper";
import { type DbPost } from "@/lib/types";
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

    return NextResponse.json(dbPosts);
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}