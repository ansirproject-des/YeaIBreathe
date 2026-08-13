import { getCurrentDbUser } from "@/lib/user/user";
import { prisma } from "@/lib/prisma";
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


    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        status: "in_progress"
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        mood: true,
        tech: true,
        notes: true,
        checkIn: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json(session)
  } catch (error) {
    console.error("GET_UNFINISHED_SESSION_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch unfinished session" },
      { status: 500 }
    );
  }
}