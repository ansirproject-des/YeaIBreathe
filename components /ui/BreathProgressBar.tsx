"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

const stepSizes = [
  "w-1.5 h-1.5",
  "w-2 h-2",
  "w-2.5 h-2.5",
  "w-3 h-3",
] as const;

type BreathProgressBarProps = {
  autoStart?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  cycles?: number;
};

export function BreathProgressBar({
  autoStart = false,
  onComplete,
  cycles = 1,
  onStart,
}: BreathProgressBarProps) {
  const [activeStep, setActiveStep] = useState(-1);
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [finished, setFinished] = useState(false);

  const started = autoStart || isStarted;
  const lastStep = stepSizes.length - 1;

  useEffect(() => {
    if (!started || finished) return;

    const interval = setInterval(() => {
      if (isBreathingIn) {
        if (activeStep < lastStep) {
          setActiveStep((prev) => prev + 1);
        } else {
          setIsBreathingIn(false);
        }
      } else {
        if (activeStep > -1) {
          setActiveStep((prev) => prev - 1);
        } else {
          if (completedCycles + 1 >= cycles) {
            clearInterval(interval);
            setFinished(true);
          } else {
            setCompletedCycles((prev) => prev + 1);
            setIsBreathingIn(true);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    started,
    finished,
    activeStep,
    isBreathingIn,
    completedCycles,
    cycles,
    lastStep,
  ]);

  useEffect(() => {
    if (!finished) return;

    const timeout = setTimeout(() => {
      onComplete?.();
    }, 0);

    return () => clearTimeout(timeout);
  }, [finished, onComplete]);

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer select-none"
      onClick={() => {
        if (!started) {
          setIsStarted(true);
          onStart?.();
        }
      }}
    >
      <div className="flex items-center gap-2">
        {stepSizes.map((size, index) => (
          <div
            key={index}
            className={`
              ${size}
              rounded-full
              transition-all
              duration-700
              ${
                started && index <= activeStep
                  ? "bg-primary"
                  : "bg-app-gray-hover"
              }
            `}
          />
        ))}
      </div>

      {!started ? (
        <Button variant="text" size="smText">
          Click to begin
        </Button>
      ) : (
        <p className="text-sm text-text-muted">
          {isBreathingIn ? "Breathe in..." : "Breathe out..."}
        </p>
      )}
    </div>
  );
}