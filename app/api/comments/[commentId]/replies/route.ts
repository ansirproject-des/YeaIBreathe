import { getReplies } from "@/lib/post/comment";
import { getCurrentDbUser } from "@/lib/user/user";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    commentId: string,
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { commentId } = await params;

    const replies = await getReplies(commentId);

    return NextResponse.json(replies);
  } catch (error) {
    console.error("GET_REPLIES_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}