import { iconMapSession } from "@/lib/session/iconMapSession";

type IconName = keyof typeof iconMapSession;

type BreathingPhase = {
  type: "inhale" | "hold" | "exhale";
  duration: number;
};

type BreathingTechnique = {
  translationKey: "breathing444" | "breathing478",
  titleKey: "breathing444.title" | "breathing478.title",
  subtitleKey: "breathing444.subtitle" | "breathing478.subtitle",
  timerLabel: string,

  cycles: number,
  secondsPerCycle: number,
  totalSeconds: number,

  phases: readonly BreathingPhase[],

  theme: {
    iconColor: string,
    buttonColor: string,
  };

  steps: {
    icons: readonly IconName[],
    paragraphs: readonly string[],
  }[],
};

export const sessionTechs = {
  box_4444: {
    translationKey: "breathing444",
    titleKey: "breathing444.title",
    subtitleKey: "breathing444.subtitle",
    timerLabel: "Follow the rhythm: inhale, hold, exhale, hold — 4 seconds each.",
    cycles: 8,
    phases: [
      { type: "inhale", duration: 4 },
      { type: "hold", duration: 4 },
      { type: "exhale", duration: 4 },
      { type: "hold", duration: 4 },
    ],
    secondsPerCycle: 16,
    totalSeconds: 128,

    theme: {
      iconColor: "bg-app-gray",
      buttonColor: "bg-primary",
    },

    steps: [
      {
        icons: ["chair", "pillow", "eye"],
        paragraphs: [
          "breathing444.instruction.message1",
        ],
      },
      {
        icons: ["yogapose", "waves"],
        paragraphs: [
          "breathing444.instruction.message2",
        ],
      },
      {
        icons: ["box"],
        paragraphs: [
          "breathing444.instruction.message3",
          "breathing444.instruction.message4",
        ],
      },
    ],
  },

  breathing_478: {
    translationKey: "breathing478",
    titleKey: "breathing478.title",
    subtitleKey: "breathing478.subtitle",
    timerLabel: "Follow the rhythm: inhale for 4, hold for 7, exhale for 8.",
    cycles: 12,
    phases: [
      { type: "inhale", duration: 4 },
      { type: "hold", duration: 7 },
      { type: "exhale", duration: 8 },
    ],
    secondsPerCycle: 19,
    totalSeconds: 228,

    theme: {
      iconColor: "bg-danger-muted",
      buttonColor: "bg-danger",
    },

    steps: [
      {
        icons: ["chairRed", "hand", "chest"],
        paragraphs: [
          "breathing478.instruction.message1",
        ],
      },
      {
        icons: ["yogaposeRed", "wavesRed"],
        paragraphs: [
          "breathing478.instruction.message2",
        ],
      },
      {
        icons: ["pause"],
        paragraphs: [
          "breathing478.instruction.message3",
          "breathing478.instruction.message4",
        ],
      },
    ],
  },
} satisfies Record<string, BreathingTechnique>;