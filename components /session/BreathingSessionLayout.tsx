"use client";

import { useEffect, useState } from "react";
import { createSession } from "@/app/actions/sessions";

import { BreathingCollapsedBar } from "@/components /session/BreathingCollapsedBar";
import { BreathingInfoPanel } from "@/components /session/BreathingInfoPanel";
import { sessionTechs } from "@/data/sessionTechs";
import { BreathingVisual } from "./BreathingVisual";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backdrop } from "../ui/Backdrop";
import { BreathingCompleteBackdrop } from "./BreathingCompleteBackdrop";
import { useTranslations } from "next-intl";
import { Header } from "@/components /layout/Header";
import { LeaveSessionModal } from "@/components /session/LeaveSessionModal";
import AudioButton from "./AudioButton";
import Image from "next/image";
import { Popover } from "../ui/Popover";
import { ModalTrigger } from "../ui/ModalTrigger";

type SessionConfig =
  (typeof sessionTechs)[keyof typeof sessionTechs];

type BreathingSessionLayoutProps = {
  mood?: string;
  tech?: string;
  config: SessionConfig;
};

export function BreathingSessionLayout({
  mood,
  tech,
  config,
}: BreathingSessionLayoutProps) {
  const [finishStep, setFinishStep] = useState<"idle" | "loading" | "done">("idle");
  const [showInfo, setShowInfo] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [started, setStarted] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();
  const common = useTranslations("common")
  const session = useTranslations("session")

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      router.push(`/session/check-in/${session.id}`);
    },
  });

  function handleContinueToCheckIn() {
    createSessionMutation.mutate({
      mood: mood === "anxious" || mood === "focus"
        ? mood
        : "stressed",

      tech: tech === "breathing_478"
        ? tech
        : "box_4444",

      duration:
        tech === "breathing_478"
          ? config.cycles * 19
          : config.cycles * 16,
    });
  }

  useEffect(() => {
    if (finishStep !== "loading") return;

    const timeout = setTimeout(() => {
      setFinishStep("done");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [finishStep]);

  if (finishStep === "loading") {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">{common("loading.label")}</p>
        <p className="text-base">
          {common("loading.preparingNextStep")}
        </p>
      </Backdrop>
    );
  }

  if (finishStep === "done") {
    return (
      <BreathingCompleteBackdrop
        translationKey={config.translationKey}
        onContinue={handleContinueToCheckIn}
        onRestart={() => {
          setFinishStep("idle");
          setHasStarted(false);
          setStarted(false);
          setShowInfo(false);
          setSessionKey((prev) => prev + 1);
        }}
        onFinish={() => router.push("/home")}
      />
    );
  }

  return (
    <>
      <div className="w-full shrink-0">
        <Header
          left={
            <LeaveSessionModal
              title={session("steps.step1.leave.modalTitle")}
              content={[
                session("steps.step1.leave.message1"),
                session("steps.step1.leave.message2"),
              ]}
              leaveLabel={session("steps.step1.leave.leaveLabel")}
              continueLabel={session("steps.step1.leave.continueLabel")}
            />
          }
          right={
            <div className="w-fit flex bg-app-gray rounded-xl items-center cursor-pointer">

              <div className="hidden sm:block">
                <Popover
                  body={
                    <div className="w-full flex flex-col">
                      <p>Thanks to ambient Adventure Artist for the original ambient music and soundscapes.</p>

                      <div className="flex-1 flex flex-col gap-1 mt-8">
                        <div className="text-xl font-bold">Athena IV</div>
                        <p className="text-text-muted">YT: @athenaiv</p>
                      </div>
                    </div>
                  }
                  placement="bottom"
                  align="end"
                >
                  <div className="size-12 flex justify-center items-center">
                    <Image
                      src="/images/athena.jpg"
                      alt="Athena"
                      height={22}
                      width={22}
                      className="rounded-full"
                    />
                  </div>
                </Popover>
              </div>

              <div className="sm:hidden">
                <ModalTrigger
                  trigger={(open) => (
                    <button
                      onClick={open}
                      className="size-12 flex justify-center items-center">
                      <Image
                        src="/images/athena.jpg"
                        alt="Athena"
                        height={22}
                        width={22}
                        className="rounded-full"
                      />
                    </button>
                  )}
                >
                  {() => (
                    <>
                      <div className="w-full flex flex-col">
                      <p>Thanks to ambient Adventure Artist for the original ambient music and soundscapes.</p>

                      <div className="flex-1 flex flex-col gap-1 mt-8">
                        <div className="text-xl font-bold">Athena IV</div>
                        <p className="text-text-muted">YT: @athenaiv</p>
                      </div>
                    </div>
                    </>
                  )}
                </ModalTrigger>

              </div>

              <AudioButton disabled={!started} />
            </div>
          }
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>
      <main
        className={`
          w-full flex flex-col justify-start items-center overflow-y-auto px-5 pt-24 hide-scrollbar
          transition-all duration-800 ease-in-out
          ${showInfo ? "flex-[0.15]" : "flex-1"}
        `}
      >
        <div
          className={`
            w-full flex items-center justify-center max-w-170 mx-auto
            transition-opacity duration-500 ease-in-out
            ${showInfo
              ? "opacity-0 translate-y-4 pointer-events-none"
              : "opacity-100 "
            }
          `}
        >
          <BreathingVisual
            key={sessionKey}
            size="lg"
            config={config}
            started={started}
            onStart={() => {
              setStarted(true);

              setHasStarted(true);
              setShowInfo(false);
            }}
            onComplete={() => {
              setShowInfo(false);
              setFinishStep("loading");
            }}
          />
        </div>
      </main>


      <section
        className={`
    w-full shrink-0 px-5 overflow-hidden
    transition-all duration-300 ease-in-out
    ${hasStarted
            ? "max-h-0 opacity-0 -translate-y-3 pt-0 border-t-0"
            : "max-h-40 opacity-100 translate-y-0 pt-4 border-t-[1.5px] border-divider-surface"
          }
  `}
      >
        <div className="w-full max-w-170 mx-auto mb-8 flex flex-col items-center justify-center">
          <BreathingCollapsedBar
            title={config.titleKey}
            subtitle={config.subtitleKey}
            isOpen={showInfo}
            onToggle={() => setShowInfo((prev) => !prev)}
          />
        </div>
      </section>


      <section className="w-full shrink-0 px-5 overflow-hidden">
        <div className="w-full max-w-170 mx-auto flex flex-col items-center">
          <BreathingInfoPanel
            isOpen={showInfo && !hasStarted}
            theme={config.theme}
            steps={config.steps}
          />
        </div>
      </section>
    </>
  );
}