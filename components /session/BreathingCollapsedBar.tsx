import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

type BreathingCollapsedBarProps = {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function BreathingCollapsedBar({
  title,
  subtitle,
  isOpen,
  onToggle,
}: BreathingCollapsedBarProps) {
  const session = useTranslations("session.steps.step1")
  return (
    <>
    <button className="w-full group cursor-pointer" onClick={onToggle}>
      <div className="w-full max-w-140 mx-auto text-text-muted text-start font-medium text-sm mb-4">
        <p>{session("label")}</p>
      </div>

      <div className="w-full max-w-140 mx-auto flex justify-between">
        <div className="w-full flex flex-col items-start gap-0.5">
          <h4 className="font-bold text-text">{session(title)}</h4>

          <p className="text-text-muted">{session(subtitle)}</p>
        </div>

     
          <ArrowUp
            className={`
              group-hover:text-text
              transition-transform duration-200
              text-text-muted
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          />

      </div>
      </button>
    </>
  );
}