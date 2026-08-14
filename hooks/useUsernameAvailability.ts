"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { validateUsername } from "@/lib/user/validation";
import type { UsernameStatus } from "@/app/types/username";
import { checkUsernameAvailability } from "@/app/actions/user";

export function useUsernameAvailability(
  username: string,
  savedUsername?: string,
) {
  const [availability, setAvailability] =
    useState<UsernameStatus>("idle");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const requestIdRef = useRef(0);

  const welcome = useTranslations("welcome");

  const usernameCache = useRef<
    Record<
      string,
      {
        available: boolean;
        suggestions: string[];
      }
    >
  >({});

  const validationKey = validateUsername(username);

  const hasChanged =
    savedUsername === undefined
      ? true
      : username !== savedUsername;

  useEffect(() => {
    if (!hasChanged) {
      return;
    }

    // Username is invalid locally.
    // No API request is needed.
    if (validationKey) {
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    const cached = usernameCache.current[username];

    if (cached) {
      setAvailability(
        cached.available ? "available" : "taken"
      );
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
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        usernameCache.current[username] = {
          available: result.available,
          suggestions: result.suggestions,
        };

        setSuggestions(result.suggestions);

        setAvailability(
          result.available
            ? "available"
            : "taken"
        );
      }, wait);
    }, 500);

    return () => clearTimeout(timeout);
  }, [username, validationKey, hasChanged]);

  const status: UsernameStatus =
    !hasChanged
      ? "idle"
      : validationKey
        ? "invalid"
        : availability;

  const message =
    status === "checking"
      ? welcome("checking")
      : status === "available"
        ? welcome("availableUsername")
        : status === "taken"
          ? welcome("usernameTaken")
          : status === "invalid"
            ? validationKey
              ? welcome(validationKey)
              : ""
            : "";

  return {
    status,
    message,
    suggestions,
  };
}