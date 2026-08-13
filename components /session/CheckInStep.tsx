"use client"

import { useState } from "react";
import { SaveSessionButton } from "./SaveSessionButton";
import { CheckInTabs, type CheckInValue } from "./CheckInTabs";
import { Textbox } from "../ui/Textbox";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSession } from "@/app/actions/sessions";
import { Backdrop } from "../ui/Backdrop";
import { SessionCompletedBackdrop } from "./SessionCompletedBackdrop";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type CheckInStepProps = {
  sessionId: string,
}

export function CheckInStep({ sessionId }: CheckInStepProps) {
  const [checkIn, setCheckIn] = useState<CheckInValue | null>(null)
  const [checkInError, setCheckInError] = useState<string>();
  const [notes, setNotes] = useState("")

  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useTranslations("session.steps.step2");
  const common = useTranslations("common");

  const updateSessionMutation = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["unfinished-session"] });
    },
    onError: (error) => {
      console.error("UPDATE_SESSION_MUTATION_ERROR", error);
    },
  });


  const notesError =
    notes.length === 500
      ? session("notes.error")
      : "";

  function handleSave() {
    if (!checkIn) {
      setCheckInError(session("moodResult.error"));
      return;
    }

    setCheckInError("");

    updateSessionMutation.mutate({
      sessionId,
      notes,
      checkIn,
      status: "completed",
    });
  }

  function finishSession() {
    localStorage.removeItem("unfinishedSession");
    router.push("/home");
  }

  function goToMySpace() {
    localStorage.removeItem("unfinishedSession");
    router.push("/my-space");
  }

  if (updateSessionMutation.isPending) {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">{common("loading.saving.label")}</p>
        <p className="text-base">{common("loading.saving.savingSession")}</p>
      </Backdrop>
    );
  }

  if (updateSessionMutation.isSuccess) {
    return (
      <SessionCompletedBackdrop
        onFinish={finishSession}
        onGoToMySpace={goToMySpace}
      />
    );
  }

  return (
    <>
      <main className="w-full max-w-170 flex-1 flex flex-col items-center gap-9 px-5 overflow-y-auto hide-scrollbar">
        <div className="w-full max-w-140 flex flex-1 flex-col mt-8 gap-6">

          <div className="w-full flex flex-col gap-1.5">
            <h2 className="w-full text-2xl font-bold">{session("titleCheckIn")}</h2>

            <p className="w-full text-text-muted">{session("subtitleCheckIn")}</p>
          </div>

          <div className="w-full flex flex-1 flex-col gap-8">
            <CheckInTabs
              selected={checkIn}
              onSelect={(value) => {
                setCheckIn(value);
                setCheckInError("");
              }}
              error={checkInError}
            />
            <Textbox
              label={session("notes.label")}
              value={notes}
              onChange={setNotes}
              autoFocus
              placeholder={session("notes.placeholder")}
              helperText={notesError}
              helperVariant={notesError ? "error" : "default"}
              helperIndicator
            />
          </div>

        </div>

      </main>


      <footer className="w-full shrink-0 px-5 overflow-hidden pt-4 border-t-[1.5px] border-divider-surface">
        <div className="w-full max-w-170 mx-auto mb-12 sm:mb-14 flex flex-col items-center">


          <div className="w-full max-w-140 flex text-text-muted text-sm font-medium mb-4">
            <p>{session("label")}</p>
          </div>

          <div className="w-full max-w-140 flex justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-text">{session("title")}</h4>
              <p className="text-text-muted">
                {session("subtitle")}
              </p>
            </div>


            <SaveSessionButton
              onClick={handleSave}
            />


          </div>
        </div>
      </footer>
    </>
  )
}