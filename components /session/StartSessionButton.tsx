"use client";

import { type Mood } from "@/data/session/moods";

import { Backdrop } from "../ui/Backdrop";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { useStartSession } from "./useStartSession";
import { useTranslations } from "next-intl";

type StartSessionButtonProps = {
  selectedMood: Mood | null;
};

export function StartSessionButton({ selectedMood }: StartSessionButtonProps) {
  const session = useTranslations("session");
  const common = useTranslations("common");

  const {
    isStarting,
    showStartSessionModal,
    startSession,
    startNewSessionAndDeleteOld,
    continueUnfinishedSession,
    closeStartSessionModal,
    isDeletingOldSession,
  } = useStartSession();

  function handleStart() {
    if (!selectedMood) return;

    startSession({
      mood: selectedMood.color,
      tech: selectedMood.tech,
    });
  }

  if (isStarting) {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">{common("loading.label")}</p>

        <p className="text-base mt-2">
          {common("loading.gettingStarted")}
        </p>
      </Backdrop>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <p className="w-full max-w-120 text-center text-sm text-text-muted">
        {selectedMood ? session(selectedMood.infoKey) : ""}
      </p>

      <Button
        variant={selectedMood?.color ?? "primary"}
        disabled={!selectedMood}
        type="button"
        onClick={handleStart}
        className="mt-6 w-full sm:w-fit"
      >
       {session("start")}
      </Button>

      <Modal
        isOpen={showStartSessionModal}
        onClose={closeStartSessionModal}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Button
              variant="primary"
              onClick={continueUnfinishedSession}
            >
              <span className="sm:hidden">{session("history.repeat.continueUnfinishedMobile")}</span>
              <span className="hidden sm:inline">{session("history.repeat.continueUnfinished")}</span>
            </Button>

            <Button
              variant="dangerSecondary"
              onClick={startNewSessionAndDeleteOld}
              disabled={isDeletingOldSession}
              className="w-full sm:w-fit"
            >
              <span className="sm:hidden">{session("history.repeat.startNewMobile")}</span>
              <span className="hidden sm:inline">{session("history.repeat.startNew")}</span>
            </Button>
          </div>
        }
      >
        <ConfirmationModal
          title={session("history.repeat.modalTitle")}
          content={
            <>
              <p>{session("history.repeat.message1")}</p>
              <p>{session("history.repeat.message2")}</p>
            </>
          }
        />
      </Modal>
    </div>
  );
}