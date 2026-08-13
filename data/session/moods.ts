export type MoodColor = "stressed" | "anxious" | "focus";

export type MoodTech = "box_4444" | "breathing_478";

export type Mood = {
  id: number;
  titleKey: "moodInitial.stressed" | "moodInitial.anxious" | "moodInitial.focus";
  infoKey: "moodInfo.stressed" | "moodInfo.anxious" | "moodInfo.focus";
  color: MoodColor;
  tech: MoodTech;
};


export const moods: Mood[] = [
  {
    id: 1,
    titleKey: "moodInitial.stressed",
    color: "stressed",
    infoKey: "moodInfo.stressed",
    tech: "box_4444"
  },
  {
    id: 2,
    titleKey: "moodInitial.anxious",
    color: "anxious",
    infoKey: "moodInfo.anxious",
    tech: "breathing_478"
  },
  {
    id: 3,
    titleKey: "moodInitial.focus",
    color: "focus",
    infoKey: "moodInfo.focus",
    tech: "box_4444"
  },
] as const;

