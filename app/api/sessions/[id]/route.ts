import { getCurrentDbUser } from "@/lib/user/user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const { id } = await params;

    const session = await prisma.session.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        mood: true,
        tech: true,
        duration: true,
        notes: true,
        checkIn: true,
        createdAt: true,
      }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("GET_SESSION_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
