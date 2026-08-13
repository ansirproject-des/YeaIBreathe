export const categories = [
  "productivity",
  "mindfulness",
  "self-care",
  "learning",
  "relationships",
  "work",
  "lifestyle",
] as const;

export type Topic = typeof categories[number];