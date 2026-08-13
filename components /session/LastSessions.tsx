"use client"


import { getSessions } from "@/lib/api/session";
import { useQuery } from "@tanstack/react-query";
import { SessionsState } from "./EmptySessions";
import { SurfaceCard } from "../ui/SurfaceCard";
import { formatSessionDate, } from "@/lib/session/sessions";
import { SessionsRow } from "./SessionsRow";
import { useLocale } from "next-intl";


export function LastSessions() {
  const locale = useLocale();
  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  })

  if (isLoading) {
    return (
      <SessionsState
        titleKey="loadingTitle"
        messageKey="loadingSubtitle"
      />
    );
  }

  if (error) {
    return (
      <SessionsState
        titleKey="errorTitle"
        messageKey="errorSubtitle"
      />
    );
  }

  if (sessions.length === 0) {
    return <SessionsState />;
  }

  return (
    <SurfaceCard>
      {sessions.map((session, index) => {
        return (
        <SessionsRow
          id={session.id}
          key={session.id}
          time={formatSessionDate(session.createdAt, locale)}
          notes={session.notes ?? undefined}
          showBorder={index !== sessions.length - 1}
        />
        )
      })}
    </SurfaceCard>
  )
}