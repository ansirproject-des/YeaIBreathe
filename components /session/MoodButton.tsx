import { type Mood } from "@/data/session/moods";
import { useTranslations } from "next-intl";

type MoodButtonProps = {
  mood: Mood;
  selected: boolean;
  onClick: () => void;
};

const moodStyles: Record<Mood["color"], string> = {
  stressed: "bg-stressed text-text-inverse",
  anxious: "bg-anxious text-text-inverse",
  focus: "bg-focus text-text-inverse",
};

export function MoodButton({
  mood,
  selected,
  onClick,
}: MoodButtonProps) {
  const session = useTranslations("session")
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        py-5
        rounded-[14px]
        cursor-pointer
        transition-colors
        duration-100
        font-medium

        ${
          selected
            ? moodStyles[mood.color]
            : "bg-surface text-text hover:text-text/80"
        }
      `}
    >
      {session(mood.titleKey)}
    </button>
  );
}