"use client"

import { SessionsState } from "../session/EmptySessions";
import { useLocale, } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/lib/api/session";
import { SessionsRow } from "../session/SessionsRow";
import { formatSessionDate, mapTech } from "@/lib/session/sessions";
import { SurfaceCard } from "../ui/SurfaceCard";


export function SessionsHistoryModalContent() {
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

  const visibleSessions = sessions.slice(0, 2);

  return (
    <>
      <SurfaceCard>
        {visibleSessions.map((session, index) => (
          <SessionsRow
            id={session.id}
            key={session.id}
            time={formatSessionDate(session.createdAt, locale)}
            checkIn={session.checkIn ?? undefined}
            tech={mapTech(session.tech)}
            notes={session.notes ?? undefined}
            showBorder={index !== visibleSessions.length - 1}
          />
        ))}
      </SurfaceCard>
    </>

  )
}