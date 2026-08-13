"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnfinishedSession } from "@/lib/api/session";
import { deleteSession } from "@/app/actions/sessions";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { ModalTrigger } from "../ui/ModalTrigger";
import { Button } from "../ui/Button";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { useTranslations } from "next-intl";

const content = [
  "resume.message1",
  "resume.message2",
];

export function ResumeSessionBanner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("session");

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unfinished-session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const { data: session } = useQuery({
    queryKey: ["unfinished-session"],
    queryFn: getUnfinishedSession,
  })

  function handleContinue() {
    if (!session) return;

    router.push(`/session/check-in/${session.id}`);
  }

  if (!session) return null;

  function handleDismiss() {
    if (!session) return;

    deleteSessionMutation.mutate(session.id);
  }


  return (
    <div className="w-full flex justify-between bg-app-gray py-2 px-4 gap-3 rounded-xl border border-dashed border-divider-gray">
      <div className="w-full flex flex-col items-start gap-0.5">
        <p className="text-sm text-text">
          {t("resume.message")}
        </p>

        <Button
          variant="text"
          size="smText"
          className="underline"
          onClick={handleContinue}
        >
          {t("resume.continue")}
        </Button>

      </div>

      <ModalTrigger
        trigger={(open) => (
          <IconButton
            variant="textMuted"
            type="button"
            size="fit"
            onClick={open}
          ><X className="w-4 h-4" /></IconButton>
        )}
        footer={(close) => (
          <div className="w-full flex justify-end gap-2">
            <Button variant="dangerSecondary" onClick={handleDismiss} className="w-full sm:w-fit">
              <span className="sm:hidden">{t("history.delete.deleteMobile")}</span>
              <span className="hidden sm:inline">{t("history.delete.deleteSession")}</span>
            </Button>
            <Button variant="primary" onClick={close} className="w-full sm:w-fit">
              <span className="sm:hidden">{t("history.delete.keepMobile")}</span>
              <span className="hidden sm:inline">{t("history.delete.keep")}</span>
            </Button>
          </div>
        )}
      >

        {() => (
          <ConfirmationModal
            title={t("history.delete.modalTitle")}
            content={
              <>
                {content.map((text) => (
                  <p key={text}>{t(text)}</p>
                ))}
              </>
            }
          />
        )}

      </ModalTrigger>


    </div>
  );
}