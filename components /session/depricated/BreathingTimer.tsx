"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components /ui/Button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Backdrop } from "../../ui/Backdrop";
import { BackdropButton } from "../../ui/BackdropButton";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession } from "@/app/actions/sessions";



type BreathingTimerProps = {
  mood?: string,
  tech?: string,
  config: {
    timerLabel: string,
    cycles: number,
    secondsPerCycle: number,
    totalSeconds: number,
  },
  onStart?: () => void,
  onFinish?: () => void,
};


export function BreathingTimer({ mood, tech, config, onStart, onFinish }: BreathingTimerProps) {
  const TOTAL_CYCLES = config.cycles;
  const SECONDS_PER_CYCLE = config.secondsPerCycle;
  const TOTAL_SECONDS = config.totalSeconds;


  const [secondsLeft, setSecondsLeft] = useState(config.totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [finishStep, setFinishStep] = useState<"idle" | "loading" | "done">("idle");
  const router = useRouter();

  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      router.push(`/session/check-in/${session.id}`);
    },
  });

  function handleContinueToCheckIn() {
    createSessionMutation.mutate({
      mood: mood === "anxious" || mood === "focus" ? mood : "stressed",
      tech: tech === "breathing_478" ? tech : "box_4444",
      duration: TOTAL_SECONDS,
    });
  }

  function handleStart() {
    setHasStarted(true)
    setIsRunning(true)
    onStart?.()
  }

  function handleStop() {
    setIsRunning(false);
  }

  function handleResume() {
    setIsRunning(true)
  }

  function handleRestart() {
    setFinishStep("idle")
    setHasStarted(false)
    setIsRunning(false)
    setSecondsLeft(TOTAL_SECONDS)
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const rest = seconds % 60

    return `${minutes}:${rest.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setFinishStep("loading");
          onFinish?.();
          return 0;
        }

        return prev - 1;
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, onFinish])



  useEffect(() => {
    if (finishStep !== "loading") return;

    const timeout = setTimeout(() => {
      setFinishStep("done");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [finishStep]);


  const secondsPassed = TOTAL_SECONDS - secondsLeft;

  const currentCycle =
    secondsLeft === 0
      ? TOTAL_CYCLES
      : Math.floor(secondsPassed / SECONDS_PER_CYCLE) + 1;

  if (finishStep === "loading") {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">[Loading...]</p>
        <p className="text-base">Preparing the next step...</p>
      </Backdrop>
    );
  }

  if (finishStep === "done") {
    return (
      <Backdrop>
        <h2 className="text-2xl font-bold text-surface">
          Breathing complete!
        </h2>

        <p className="max-w-72 text-surface/80">
          Take a moment to notice how your body feels now.
        </p>

        <div className="flex flex-col gap-4">
          <div className="mt-6 flex flex-col gap-2">
            <BackdropButton
              variant="primary"
              onClick={handleContinueToCheckIn}
            >
              Continue to Check-In
            </BackdropButton>

            <BackdropButton
              variant="secondary"
              className="gap-2"
              onClick={handleRestart}
            >
              Repeat breathing
              <RotateCcw className="w-5 h-5" />
            </BackdropButton>
          </div>

          <BackdropButton
            variant="text"
            size="sm"
            onClick={() => router.push("/home")}
          >
            Finish without saving
          </BackdropButton>

        </div>
      </Backdrop>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-between text-center gap-6">
      <div className="flex flex-col items-center">
        <div className="size-56 sm:size-64 md:size-72 rounded-3xl border border-text-muted p-3 sm:p-4 shrink-0">
          <div className="w-full h-full rounded-2xl border border-text-muted flex flex-col items-center justify-center">
            <p className="text-sm text-text-muted">
              Cycle {currentCycle}/{TOTAL_CYCLES}
            </p>

            <p className="mt-2 text-4xl font-bold text-text">
              {formatTime(secondsLeft)}
            </p>
          </div>
        </div>

        <p className="mt-6 sm:mt-10 max-w-120 text-text-muted">
          {config.timerLabel}
        </p>
      </div>

      <div className="w-full flex justify-center pb-4">
        {!hasStarted ? (
          <Button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-fit"
          >
            Start breathing
          </Button>
        ) : isRunning ? (
          <Button
            type="button"
            variant="secondaryGray"
            onClick={handleStop}
            className="w-full sm:w-fit"
          >
            Stop
          </Button>
        ) : (
          <div className="flex w-full sm:w-fit gap-3">
            <Button
              type="button"
              variant="secondaryGray"
              onClick={handleRestart}
              className="gap-2 flex-1 sm:flex-none"
            >
              <RotateCcw className="w-5 h-5" />
              Restart
            </Button>

            <Button
              type="button"
              variant="success"
              onClick={handleResume}
              className="flex-1 sm:flex-none"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}