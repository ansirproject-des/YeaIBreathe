"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnfinishedSession } from "@/lib/api/session";
import { deleteSession } from "@/app/actions/sessions";

type StartSessionData = {
  mood: "stressed" | "anxious" | "focus";
  tech: "box_4444" | "breathing_478";
};

export function useStartSession() {
  const [isStarting, setIsStarting] = useState(false);
  const [pendingSession, setPendingSession] = useState<StartSessionData | null>(null)

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: unfinishedSession } = useQuery({
    queryKey: ["unfinished-session"],
    queryFn: getUnfinishedSession,
  });

  const deleteOldSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unfinished-session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    }
  });

  function goToSession(data: StartSessionData) {
    setIsStarting(true);

    setTimeout(() => {
      router.push(`/session?mood=${data.mood}&tech=${data.tech}`);
    }, 2000);
  }

  function startSession(data: StartSessionData) {
    if (unfinishedSession) {
      setPendingSession(data);
      return;
    }

    goToSession(data);
  }

  async function startNewSessionAndDeleteOld() {
    if(!pendingSession || !unfinishedSession) return;

    setIsStarting(true);

    await deleteOldSessionMutation.mutateAsync(unfinishedSession.id);

    goToSession(pendingSession);
  }

  function continueUnfinishedSession() {
    if (!unfinishedSession) return;

    router.push(`/session/check-in/${unfinishedSession.id}`);
  }

  function closeStartSessionModal() {
    setPendingSession(null);
  }

  return {
    isStarting,
    showStartSessionModal: Boolean(pendingSession),
    startSession,
    startNewSessionAndDeleteOld,
    continueUnfinishedSession,
    closeStartSessionModal,
    isDeletingOldSession: deleteOldSessionMutation.isPending,
  };
}