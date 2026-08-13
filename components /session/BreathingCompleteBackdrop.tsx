import { RotateCcw } from "lucide-react";

import { Backdrop } from "../ui/Backdrop";
import { BackdropButton } from "../ui/BackdropButton";
import { useTranslations } from "next-intl";

type BreathingCompleteBackdropProps = {
  translationKey: "breathing444" | "breathing478",
  onContinue: () => void;
  onRestart: () => void;
  onFinish: () => void;
};

export function BreathingCompleteBackdrop({
  onContinue,
  onRestart,
  onFinish,
  translationKey,
}: BreathingCompleteBackdropProps) {
  const session = useTranslations("session.steps.step1")
  return (
    <Backdrop>
      <h2 className="text-2xl font-bold text-surface">
        {session(`${translationKey}.completed.title`)}
      </h2>

      <p className="max-w-72 text-surface/80">
        {session(`${translationKey}.completed.subtitle`)}
      </p>

      <div className="flex flex-col gap-4">
        <div className="mt-6 flex flex-col gap-2">
          <BackdropButton
            variant="primary"
            onClick={onContinue}
          >
            {session(`${translationKey}.completed.continue`)}
          </BackdropButton>

          <BackdropButton
            variant="secondary"
            className="gap-2"
            onClick={onRestart}
          >
            {session(`${translationKey}.completed.repeat`)}
            <RotateCcw className="w-5 h-5" />
          </BackdropButton>
        </div>

        <BackdropButton
          variant="text"
          size="sm"
          onClick={onFinish}
        >
          {session(`${translationKey}.completed.finish`)}
        </BackdropButton>
      </div>
    </Backdrop>
  );
}