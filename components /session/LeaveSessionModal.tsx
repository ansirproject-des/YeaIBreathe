"use client";

import { ArrowLeft } from "lucide-react";
import { ModalTrigger } from "../ui/ModalTrigger";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";
import { NavigateWithLoader } from "./NavigateWithLoader";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { useTranslations } from "next-intl";

type LeaveSessionModalProps = {
  title: string,
  content: string[],
  leaveLabel: string,
  continueLabel: string,
  saveUnfinishedSession?: boolean,
};

export function LeaveSessionModal({
  title,
  content,
  leaveLabel,
  continueLabel,
  saveUnfinishedSession = false,
}: LeaveSessionModalProps) {
  const common = useTranslations("common");
  const session = useTranslations("session.steps.step2");

  function handleBeforeLeave() {
    if (saveUnfinishedSession) {
      localStorage.setItem("unfinishedSession", "true");
    }
  }
  return (
    <ModalTrigger
      trigger={(open) => (
        <IconButton variant="text" onClick={open}>
          <ArrowLeft className="w-5 h-5" />
        </IconButton>
      )}
      footer={(close) => (
        <div className="w-full flex justify-end gap-2">
          <NavigateWithLoader
            to="/home"
            className="inline-flex items-center justify-center rounded-xl bg-surface text-danger font-medium px-6 py-3 hover:text-danger/80 cursor-pointer transition-all"
            loadingChildren={
              <>
                <p className="text-sm">{common("loading.label")}</p>
                <p className="text-base">{common("loading.returning")}</p>
              </>
            }
            onClick={handleBeforeLeave}
          >
            <span className="sm:hidden">{session("leave.leaveLabelMobile")}</span>
            <span className="hidden sm:inline">{leaveLabel}</span>
          </NavigateWithLoader>

          <Button className="w-full sm:w-fit" variant="primary" onClick={close}>
            <span className="sm:hidden">{session("leave.continueLabel")}</span>
            <span className="hidden sm:inline">{continueLabel}</span>
          </Button>
        </div>
      )}
    >
      {() => (
        <ConfirmationModal title={title} content={content.map((text) => (
          <p key={text}>{text}</p>
        ))} />
      )}
    </ModalTrigger>
  );
}