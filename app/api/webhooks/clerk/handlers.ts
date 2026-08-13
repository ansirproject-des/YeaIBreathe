import { prisma } from "@/lib/prisma";
import type { UserData } from "./mapper";


export async function handleUserCreated({
  clerkId,
  email,
  avatar,
  firstName,
}: UserData
) {
  if (!email) {
    console.error("User has no email.");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (existingUser) {
    console.log("User already exists.");
    return;
  }

  const baseUsername =
  (firstName ?? "user")
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");

    const username =
  `${baseUsername || "user"}_${clerkId.slice(-6)}`
    .toLowerCase();

await prisma.user.create({
  data: {
    clerkId,
    email,
    avatar,
    firstName,

    displayName: firstName ?? "User",
    username: username,
  },
});

  console.log("User created in database.");

}