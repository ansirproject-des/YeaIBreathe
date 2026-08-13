export type DbSession = {
  id: string,
  mood: "stressed" | "anxious" | "focus",
  tech: "box_4444" | "breathing_478",
  notes: string | null,
  checkIn: "better" | "same" | "tense" | null,
  duration: number,
  createdAt: string,
}

export function formatSessionDate(
  date: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(new Date(date));
}

export function mapMood(mood: DbSession["mood"]) {
  if (mood === "stressed") return "same";
  if (mood === "anxious") return "stillStressed";
  return "better";
}

export function mapTech(tech: DbSession["tech"]) {
  if (tech === "box_4444") return "Box4444";
  return "478";
}