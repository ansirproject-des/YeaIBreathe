import { NextResponse } from "next/server";
import { handleUserCreated } from "./handlers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "./verify";
import { mapClerkUser } from "./mapper";


export async function POST(req: Request) {
  let event: WebhookEvent;

  try {
    event = await verifyWebhook(req);
  } catch (error) {
    console.error("Invalid webhook signature.", error);

    return new Response("Invalid signature", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
      try {
        await handleUserCreated(mapClerkUser(event.data));
      } catch (error) {
        console.error("USER CREATION FAILED", error);
        return new Response("Failed", { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ ok: true });
}

