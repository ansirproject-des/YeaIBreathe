import { getNotifications } from "@/lib/notification/notification";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const notifications = await getNotifications()

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("GET_NOTIFICATIONS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}