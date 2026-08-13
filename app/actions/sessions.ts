"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/user/user";

const createSessionSchema = z.object({
  mood: z.enum(["stressed", "anxious", "focus"]),
  tech: z.enum(["box_4444", "breathing_478"]),
  duration: z.number().int().positive(),
  notes: z.string().optional(),
});

const updateSessionSchema = z.object({
  notes: z.string().optional(),
  checkIn: z.enum(["better", "same", "tense"]).optional(),
  status: z.enum(["completed"]),
});

type UpdateSessionData = {
  sessionId: string;
  notes?: string;
  checkIn?: "better" | "same" | "tense";
  status: "completed";
};

export async function createSession(data: unknown) {
  try {
    const result = createSessionSchema.safeParse(data);

    if (!result.success) {
      throw new Error("Invalid session data");
    }

    const user = await getCurrentDbUser();

    return prisma.session.create({
      data: {
        userId: user.id,
        ...result.data,
      },
    });

  } catch (error) {
    console.error("CREATE_SESSION_ERROR", error);
    throw error;
  }
}


export async function updateSession(data: UpdateSessionData) {
  const user = await getCurrentDbUser();

  const result = updateSessionSchema.safeParse({
    notes: data.notes,
    checkIn: data.checkIn,
    status: data.status,
  });

  if (!result.success) {
    throw new Error("Invalid session data");
  }

  const existingSession = await prisma.session.findFirst({
    where: {
      id: data.sessionId,
      userId: user.id,
    },
  });

  if (!existingSession) {
    throw new Error("Session not found");
  }

  return prisma.session.update({
    where: {
      id: data.sessionId,
    },
    data: {
      notes: result.data.notes,
      checkIn: result.data.checkIn,
      status: result.data.status,
    },
  });
}


export async function deleteSession(sessionId: string) {
  const user = await getCurrentDbUser();

  const existingSession = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
    },
  });

  if (!existingSession) {
    throw new Error("Session not found");
  }

  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });

  return { message: "Session deleted" };
}