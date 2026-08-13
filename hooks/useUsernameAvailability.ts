"use client";

import { useEffect, useRef, useState } from "react";

import { validateUsername } from "@/lib/user/validation";
import type { AvailabilityStatus, UsernameStatus, } from "@/app/types/username";
import { checkUsernameAvailability } from "@/app/actions/user";


export function useUsernameAvailability(
  username: string,
  savedUsername?: string,
) {
  const [availability, setAvailability] = useState<AvailabilityStatus>("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const requestIdRef = useRef(0);

  const usernameCache = useRef<
    Record<
      string,
      {
        available: boolean;
        suggestions: string[];
      }
    >
  >({});

  const validationError = validateUsername(username);
  const hasChanged =
    savedUsername === undefined
      ? true
      : username !== savedUsername;


  useEffect(() => {
    if (!hasChanged) {
      return;
    }

    if (validationError) {
      return;
    }
    const currentRequestId = ++requestIdRef.current;
    const cached = usernameCache.current[username];

    if (cached) {
      setAvailability(cached.available ? "available" : "taken");
      setSuggestions(cached.suggestions);
      return;
    }

    setSuggestions([]);

    const timeout = setTimeout(async () => {
      setAvailability("checking");

      const start = Date.now();

      const result = await checkUsernameAvailability(username);

      const elapsed = Date.now() - start;
      const wait = Math.max(0, 300 - elapsed);

      setTimeout(() => {
        if (currentRequestId !== requestIdRef.current) return;

        usernameCache.current[username] = {
          available: result.available,
          suggestions: result.suggestions,
        };

        setSuggestions(result.suggestions);
        setAvailability(result.available ? "available" : "taken");
      }, wait);
    }, 500);

    return () => clearTimeout(timeout);
  }, [username, validationError, hasChanged]);

  const status: UsernameStatus =
  !hasChanged
    ? "idle"
    : validationError
      ? "invalid"
      : availability;

  const message =
    status === "checking"
      ? "Checking availability..."
      : status === "available"
        ? "Username is available."
        : status === "taken"
          ? "This username is already taken."
          : status === "invalid"
            ? validationError ?? ""
            : "";

  return {
    status,
    message,
    suggestions,
  };
}