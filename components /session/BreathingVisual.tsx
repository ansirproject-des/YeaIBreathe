"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { useTranslations } from "next-intl";

type RadialNodeProps = {
  angle: number,
  dotCount: number,
  isExpanded: boolean,
  started: boolean,
  accentColor?: string,
  duration: number,
  phase: "inhale" | "hold" | "exhale",
}

function RadialNode({ angle, dotCount, isExpanded, started, accentColor, duration, phase }: RadialNodeProps) {
  const DOT_SPACING = 28;

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `rotate(${angle}deg) translateY(20px)`,
      }}
    >

      <div className="relative flex flex-col items-center">

        <motion.div
          className="absolute bottom-0 w-px bg-app-gray-hover"
          style={{
            transformOrigin: "bottom center",
          }}
          initial={{ height: 54 }}
          animate={{
            height: !started
              ? 54
              : isExpanded
                ? 90
                : 54,
          }}
          transition={{
            duration: phase === "hold" ? 0 : duration,
            ease: "easeInOut",
          }}
        />

        <div className="relative h-2 w-2">
          {Array.from({ length: dotCount }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full"
              animate={{
                y: !started
                  ? 0
                  : isExpanded
                    ? -(index + 1) * DOT_SPACING
                    : 0,
                opacity: isExpanded ? 0.6 : 1,
                backgroundColor:
                  accentColor &&
                    accentColor &&
                    started &&
                    isExpanded &&
                    index === dotCount - 1
                    ? accentColor
                    : "var(--color-primary)",
              }}
              transition={{
                duration: phase === "hold" ? 0 : duration,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}


type BreathingVisualProps = {
  size?: "md" | "lg",
  config: {
    timerLabel: string;
    cycles: number;
    phases: {
      type: "inhale" | "hold" | "exhale",
      duration: number,
    }[];
  },
  onComplete: () => void,

  onPhaseChange?: (
    phase: "inhale" | "hold" | "exhale"
  ) => void,
  started: boolean;
  onStart: () => void;
};


export function BreathingVisual({
  config,
  started,
  onStart,
  onComplete,
  onPhaseChange,
  size = "md",
}: BreathingVisualProps) {
  const common = useTranslations("common")
  const session = useTranslations("session")

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(config.phases[0].duration);

  const currentPhase = config.phases[phaseIndex];
  const [isExpanded, setIsExpanded] = useState(
    config.phases[0].type === "inhale"
  );

  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const countdownRef = useRef(countdown);
  const phaseIndexRef = useRef(phaseIndex);
  const cyclesCompletedRef = useRef(cyclesCompleted);

  const NODE_COUNT = 36;
  const TOTAL_CYCLES = config.cycles;
  const cyclesLeft = TOTAL_CYCLES - cyclesCompleted;

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    phaseIndexRef.current = phaseIndex;
  }, [phaseIndex]);

  useEffect(() => {
    cyclesCompletedRef.current = cyclesCompleted;
  }, [cyclesCompleted]);

  const phases = config.phases;

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      const currentCountdown = countdownRef.current;
      const currentPhaseIndex = phaseIndexRef.current;

      if (currentCountdown > 1) {
        setCountdown((prev) => prev - 1);
        return;
      }

      const nextPhaseIndex = currentPhaseIndex + 1;

      // Move to the next phase within the current cycle
      if (nextPhaseIndex < phases.length) {
        const nextPhase = phases[nextPhaseIndex];

        phaseIndexRef.current = nextPhaseIndex;
        setPhaseIndex(nextPhaseIndex);

        switch (nextPhase.type) {
          case "inhale":
            setIsExpanded(true);
            break;

          case "exhale":
            setIsExpanded(false);
            break;

          case "hold":
            // Keep the current visual state
            break;
        }

        onPhaseChange?.(nextPhase.type);
        setCountdown(nextPhase.duration);

        return;
      }

      // Cycle finished
      const completed = cyclesCompletedRef.current + 1;

      cyclesCompletedRef.current = completed;
      setCyclesCompleted(completed);

      if (completed >= TOTAL_CYCLES) {
        onComplete();
        return;
      }

      // Start the next cycle (always begins with inhale)
      phaseIndexRef.current = 0;
      setPhaseIndex(0);
      setIsExpanded(true);
      onPhaseChange?.("inhale");
      setCountdown(phases[0].duration);

    }, 1000);

    return () => clearInterval(interval);
  }, [
    started,
    onComplete,
    onPhaseChange,
    phases,
    TOTAL_CYCLES,
  ]);

  const dotPattern = Array.from(
    { length: NODE_COUNT },
    (_, index) => (index % 3) + 1
  );

  const accentNodes = {
    1: "#90C5FF",
    6: "#90C5FF",
    3: "#E39F72",
    8: "#E39F72",
    11: "#E39F72",
    12: "#90C5FF",
    14: "#90C5FF",
    18: "#E39F72",
    20: "#90C5FF",
    21: "#E39F72",
    24: "#E39F72",
    26: "#90C5FF",
    28: "#E39F72",
    29: "#90C5FF",
    30: "#E39F72",
    33: "#90C5FF",
  } as const;

  const containerSize =
    size === "lg"
      ? "h-90 w-90"
      : "h-72 w-72";

  const cycleLabel =
    cyclesLeft === 1
      ? session("cycles.one")
      : cyclesLeft >= 2 && cyclesLeft <= 4
        ? session("cycles.few")
        : session("cycles.many");

  return (
    <div className={`relative ${containerSize}`}>
      {!started ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center ">
          <Button
            onClick={() => {
              phaseIndexRef.current = 0;
              countdownRef.current = config.phases[0].duration;
              cyclesCompletedRef.current = 0;

              setPhaseIndex(0);
              setCountdown(config.phases[0].duration);
              setCyclesCompleted(0);

              onStart();

              setIsExpanded(
                config.phases[0].type === "inhale"
              );
            }}
          >
            {common("start")}</Button>
        </div>
      ) : (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <p className="text-6xl font-bold">{countdown}</p>
            <p className="text-lg">{session(`phases.${currentPhase.type}`)}</p>
          </div>
          <p className="text-sm text-text-muted">
            {cyclesLeft} {cycleLabel}
          </p>
        </div>
      )}

      {dotPattern.map((dotCount, index) => (
        <RadialNode
          key={index}
          angle={(360 / NODE_COUNT) * index}
          dotCount={dotCount}
          isExpanded={isExpanded}
          started={started}
          accentColor={accentNodes[index as keyof typeof accentNodes]}
          duration={currentPhase.duration}
          phase={currentPhase.type}
        />
      ))}
    </div>
  );
}