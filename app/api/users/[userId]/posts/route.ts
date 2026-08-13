import { getPublicProfilePosts } from "@/lib/user/user";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    userId: string,
  }>
}

export async function GET(request: Request, {params}: RouteContext) {
  const { userId } = await params;

  const posts = await getPublicProfilePosts(userId);

  return NextResponse.json(posts);
}