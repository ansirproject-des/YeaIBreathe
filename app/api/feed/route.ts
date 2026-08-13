import { getFeed } from "@/lib/feed/feed";
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

    const posts = await getFeed(user.id)

    return NextResponse.json(posts)

  } catch (error) {
    console.error("GET_FEED_POSTS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}