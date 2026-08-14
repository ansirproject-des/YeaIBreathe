import { useCallback, useState } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { IntroSlide } from "./slides/IntroSlide-1";
import { BreathingSlide } from "./slides/BreathingSlide-2";
import { ReflectionSlide } from "./slides/ReflectionSlide-3";
import { FeaturesSlide } from "./slides/FeaturesSlide-4";
import { MoveLeft } from "lucide-react";
import { CompleteOnboarding } from "@/app/actions/user";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

type OnboardingModalProps = {
  onCompleted: () => void,
}

export function OnboardingModal({ onCompleted }: OnboardingModalProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [breathingKey, setBreathingKey] = useState(0);

  const onboarding = useTranslations("onboarding");


  const goToNextStep = useCallback(() => {
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleGetStarted = async () => {
    setIsSaving(true);
    await CompleteOnboarding();
    onCompleted();
  }

  const resetBreathing = useCallback(() => {
    setBreathingStarted(false);
    setPhase("inhale");
    setBreathingKey((prev) => prev + 1);
  }, []);

  const back = () => {
    setStepIndex((prev) => {
      const next = prev - 1;

      if (next === 1) {
        resetBreathing();
      }

      return next;
    });
  };

  const completeBreathing = useCallback(() => {
    setBreathingStarted(false);
    setPhase("inhale");
    goToNextStep();
  }, [goToNextStep]);

  let currentStep: {
    content: React.ReactNode;
    footer: React.ReactNode;
  };

  switch (stepIndex) {
    case 0:
      currentStep = {
        content: <IntroSlide />,
        footer: (
          <div className="w-full flex gap-2 justify-between">
            <Button
              variant="text"
              onClick={onCompleted}
              size="smText"
              className="underline"
            >{onboarding("intro.skip")}</Button>

            <Button
              onClick={() => {
                resetBreathing();
                goToNextStep();
              }}
            >
             {onboarding("intro.ok")}
            </Button>
          </div>
        ),
      };
      break;

    case 1:
      currentStep = {
        content: (
          <BreathingSlide
            key={breathingKey}
            onComplete={completeBreathing}
            onPhaseChange={setPhase}
            onStart={() => {
              setBreathingStarted(true);
              setPhase("inhale");
            }}
            breathingStarted={breathingStarted}
            phase={phase}
          />
        ),
        footer: (
          <div className="w-full flex items-center justify-between gap-4">
            <Button
              variant="text"
              size="smText"
              onClick={back}
              className="flex gap-1.5 shrink-0"
            >
              <MoveLeft className="w-4 h-4" />
              {onboarding("breathing.back")}
            </Button>

            <div className="flex-1">
            </div>

            <Button
              variant="secondaryGray"
              size="sm"
              className="shrink-0"
              onClick={() => {
                resetBreathing();
                goToNextStep();
              }}
            >
              {onboarding("breathing.skip")}
            </Button>
          </div>
        ),
      };
      break;

    case 2:
      currentStep = {
        content: <ReflectionSlide />,
        footer: (
          <div className="w-full flex items-center justify-between">
            <Button
              variant="text"
              onClick={back}
              size="smText"
              className="flex gap-1.5" >
              <MoveLeft className="w-4 h-4" />
              {onboarding("reflection.back")}
            </Button>

            <Button onClick={goToNextStep} className="gap-1.5">
              {onboarding("reflection.continue")}<span className="text-text-muted">3/4</span>
            </Button>
          </div>
        ),
      };
      break;

    case 3:
      currentStep = {
        content: <FeaturesSlide />,
        footer: (
          <div className="w-full flex items-center justify-between">
            <Button
              variant="text"
              onClick={back}
              size="smText"
              className="flex gap-1.5">
              <MoveLeft className="w-4 h-4" />
             {onboarding("features.back")}
            </Button>
            <Button
              onClick={handleGetStarted}
              disabled={isSaving}
            >
              {isSaving ?onboarding("features.saving") : onboarding("features.getStarted")}
            </Button>
          </div>
        ),
      };
      break;



    default:
      currentStep = {
        content: null,
        footer: null
      };
      break;
  }


  return (
    <Modal
      isOpen
      onClose={() => { }}
      className="h-135"
      footer={currentStep.footer}
    >


      <motion.div
        key={stepIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentStep.content}
      </motion.div>
    </Modal>
  )
}