import type { SessionBadgeVariants } from "@/components /session/SessionBadge";

export function getCheckInBadgeVariant(
  checkIn: "better" | "same" | "tense"
): SessionBadgeVariants {
  switch (checkIn) {
    case "better":
      return "better";
    case "same":
      return "same";
    case "tense":
      return "stillStressed";
  }
}

export function getCheckInBadgeKey(
  checkIn: "better" | "same" | "tense"
): "better" | "same" | "stillStressed" {
  switch (checkIn) {
    case "better":
      return "better";
    case "same":
      return "same";
    case "tense":
      return "stillStressed";
  }
}

export function getTechBadgeKey(
  tech: "Box4444" | "478"
): "box4444" | "breathing478" {
  return tech === "478"
    ? "breathing478"
    : "box4444";
}