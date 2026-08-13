"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/api/session";
import { deleteSession } from "@/app/actions/sessions";

import { Button } from "@/components /ui/Button";
import { SessionBadge } from "@/components /session/SessionBadge";
import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { useRouter } from "next/navigation";
import { Backdrop } from "../ui/Backdrop";
import { ModalTrigger } from "../ui/ModalTrigger";
import { ConfirmationModal } from "../ui/ConfirmationModal";

import { useStartSession } from "./useStartSession";
import { Modal } from "../ui/Modal";
import { useLocale, useTranslations } from "next-intl";
import { getTechBadgeKey, } from "@/lib/session/session";
import { Popover } from "../ui/Popover";

type SessionDetailsProps = {
  sessionId: string;
};

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDuration(
  seconds: number,
  minuteLabel: string,
) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return `${minutes}:${rest.toString().padStart(2, "0")}${minuteLabel}`;
}

function mapMood(mood: string) {
  if (mood === "anxious") return "mood.moodInitial.anxious";
  if (mood === "focus") return "mood.moodInitial.focus";
  return "mood.moodInitial.stressed";
}

function mapCheckIn(checkIn: string | null | undefined) {
  if (checkIn === "better") return "mood.moodResult.better";
  if (checkIn === "same") return "mood.moodResult.same";
  if (checkIn === "tense") return "mood.moodResult.tense";
  return "mood.moodResult.blank";
}

export function SessionDetails({ sessionId }: SessionDetailsProps) {
  const t = useTranslations("session.history");
  const common = useTranslations("common")
  const router = useRouter();
  const queryClient = useQueryClient();
  const locale = useLocale();

  const {
    isStarting,
    startSession,
    showStartSessionModal,
    startNewSessionAndDeleteOld,
    continueUnfinishedSession,
    closeStartSessionModal,
    isDeletingOldSession,
  } = useStartSession();

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["unfinished-session"] });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] })


      router.push("/my-space")
    },
    onError: (error) => {
      console.error("DELETE_SESSION_ERROR", error)
    }
  })

  const {
    data: session,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
  });

  function handleDelete() {
    deleteSessionMutation.mutate(sessionId)
  }

  if (deleteSessionMutation.isPending) {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">{common("loading.deleting.label")}</p>
        <p className="text-base">{common("loading.deleting.deletingSession")}</p>
      </Backdrop>
    );
  }

  if (isStarting) {
    return (
      <Backdrop showSpinner>
        <p className="text-sm">{common("loading.label")}</p>
        <p className="text-base">{common("loading.preparingSession")}</p>
      </Backdrop>
    );
  }

  if (isPending) {
    return <p className="p-5 text-text-muted">{t("loading.pending")}</p>;
  }

  if (isError || !session) {
    return <p className="p-5 text-danger">{t("loading.fail")}</p>;
  }

  const techVariant =
    session.tech === "breathing_478" ? "478" : "Box4444";

  return (
    <>
      <Modal
        isOpen={showStartSessionModal}
        onClose={closeStartSessionModal}
        footer={
          <div className="w-full flex justify-end gap-2">

            <Button
              variant="dangerSecondary"
              onClick={startNewSessionAndDeleteOld}
              disabled={isDeletingOldSession}
            >
              {t("repeat.startNew")}
            </Button>

            <Button variant="primary" onClick={continueUnfinishedSession}>
              {t("repeat.continueUnfinished")}
            </Button>

          </div>
        }
      >
        <ConfirmationModal
          title={t("repeat.modalTitle")}
          content={
            <>
              <p>{t("repeat.message1")}</p>
              <p>{t("repeat.message2")}</p>
            </>
          }
        />
      </Modal>

      <div className="w-full shrink-0 pb-5 border-b-[1.5px] border-divider-surface">
        <div className="w-full max-w-140 mx-auto px-5 flex flex-col gap-2">
          <h1 className="w-full text-3xl font-bold text-text">{t("title")}</h1>

          <p className="w-full text-text-muted">
            {formatDate(session.createdAt, locale)}
          </p>
        </div>
      </div>

      <main className="w-full flex-1 overflow-y-auto hide-scrollbar px-5">
        <div className="w-full max-w-170 mx-auto flex flex-col py-8 gap-8">
          <div className="w-full max-w-140 mx-auto flex flex-col gap-3">
            <SurfaceCard>
              <div className="w-full flex flex-col gap-1">
                <p className="text-sm text-text-muted">{t("summary.felt")}</p>

                <div className="w-full flex items-center font-medium gap-1.5">
                  <p>{t(mapMood(session.mood))} →</p>
                  <p >{t(mapCheckIn(session.checkIn))}</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <p className="text-sm text-text-muted">{t("summary.tech")}</p>

                <div className="w-full hidden sm:block">
                  <Popover
                    title={session.tech === "box_4444"
                      ? "4-4-4-4"
                      : "4-7-8"
                    }
                    body={session.tech === "box_4444"
                      ? "A balanced breathing pattern that helps regulate the nervous system without greatly slowing your breathing. Often used to manage mild to moderate stress and improve focus."
                      : "The extended exhale promotes parasympathetic “rest and digest” activity, making it especially useful when you need to calm intense anxiety or prepare for rest."
                    }
                  >
                    <SessionBadge variant={techVariant}>
                      {t(`badges.${getTechBadgeKey(techVariant)}`)}
                    </SessionBadge>
                  </Popover>
                </div>

                <div className="w-full sm:hidden">
                  <ModalTrigger
                    trigger={(open) => (
                      <button onClick={open}>
                        <SessionBadge variant={techVariant}>
                          {t(`badges.${getTechBadgeKey(techVariant)}`)}
                        </SessionBadge>
                      </button>
                    )}
                  >
                    {() => (
                      <>
                        <div className="w-full mb-4">
                          <h3 className="text-xl text-text font-bold">
                            {session.tech === "box_4444"
                              ? "4-4-4-4"
                              : "4-7-8"
                            }
                          </h3>
                        </div>

                        <p>{session.tech === "box_4444"
                          ? "A balanced breathing pattern that helps regulate the nervous system without greatly slowing your breathing. Often used to manage mild to moderate stress and improve focus."
                          : "The extended exhale promotes parasympathetic “rest and digest” activity, making it especially useful when you need to calm intense anxiety or prepare for rest."
                        }</p>
                      </>
                    )}
                  </ModalTrigger>
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <p className="text-sm text-text-muted">{t("summary.duration")}</p>

                <div className="w-full flex font-medium gap-1">
                  <p>
                    {formatDuration(
                      session.duration,
                      t("summary.time.min")
                    )} •
                  </p>
                  <p>
                    {session.duration} {t("summary.time.sec")}
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="min-h-60">
              <p>
                {session.notes || t("notes")}
              </p>
            </SurfaceCard>
          </div>

          <div className="w-full max-w-140 mx-auto flex flex-col gap-2">
            <Button
              onClick={() => startSession({
                mood: session.mood,
                tech: session.tech,
              })}
              variant="secondary">{t("repeat.label")}</Button>
            <ModalTrigger
              trigger={(open) => (
                <Button
                  variant="dangerSecondary"
                  onClick={open}
                >{t("delete.label")}</Button>
              )}

              footer={(close) => (
                <div className="w-full flex justify-end gap-2">
                  <Button className="w-full sm:w-fit" variant="dangerSecondary" onClick={handleDelete}>
                    <span className="sm:hidden">{t("delete.deleteMobile")}</span>
                    <span className="hidden sm:inline">{t("delete.deleteSession")}</span>
                  </Button>
                  <Button className="w-full sm:w-fit" variant="primary" onClick={close}>
                    {t("delete.keep")}
                  </Button>
                </div>
              )}
            >

              {() => (
                <ConfirmationModal title={t("delete.modalTitle")} content={t("delete.message")} />
              )}


            </ModalTrigger>

          </div>
        </div>
      </main>
    </>
  )
}

