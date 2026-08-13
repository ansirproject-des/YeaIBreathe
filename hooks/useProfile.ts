"use client";

import { useUser } from "@clerk/nextjs";

export function useProfile() {
  const { user, isLoaded } = useUser();

  const name = user?.fullName ?? user?.username ?? user?.firstName ?? "User";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatar = user?.imageUrl;

  return {
    isLoaded,
    name,
    email,
    avatar,
  };
}