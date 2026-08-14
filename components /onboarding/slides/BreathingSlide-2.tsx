import { AnimatePresence, motion } from "motion/react";
import { BreathingVisual } from "@/components /session/BreathingVisual";
import { sessionTechs } from "@/data/sessionTechs";
import { useTranslations } from "next-intl";

type BreathingSlideProps = {
  onComplete: () => void,
  onPhaseChange?: (
    phase: "inhale" | "hold" | "exhale"
  ) => void,

  breathingStarted: boolean,
  onStart: () => void,

  phase: "inhale" | "hold" | "exhale",
};

const onboardingBreathingConfig = {
  ...sessionTechs.box_4444,
  cycles: 2,
};

export function BreathingSlide({
  onComplete,
  onPhaseChange,
  onStart,
  breathingStarted,
  phase,
}: BreathingSlideProps) {
  const onboarding = useTranslations("onboarding");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-12 gap-14">
      <BreathingVisual
        config={onboardingBreathingConfig}
        started={breathingStarted}
        onStart={onStart}
        onPhaseChange={onPhaseChange}
        onComplete={onComplete}
      />

      <div className="h-6 flex items-center justify-center">
        {!breathingStarted ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-text-muted text-center"
          >
            {onboarding("breathing.message")}
          </motion.p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="text-sm text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {phase === "inhale" && onboarding("breathing.inhale")}

              {phase === "hold" && onboarding("breathing.hold")}

              {phase === "exhale" && onboarding("breathing.exhale")}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}