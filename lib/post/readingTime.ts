export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}