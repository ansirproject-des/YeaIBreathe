import { useTranslations } from "next-intl";

type SessionsStateProps = {
  titleKey?: string,
  messageKey?: string,
}

export function SessionsState({
  titleKey = "blankTitle",
  messageKey = "blankSubtitle",
}: SessionsStateProps) {
  const mySpace = useTranslations("mySpace.menu.lastSessions.card")

  return (
    <div className="w-full py-8 flex flex-col items-center text-center gap-0.5">
      <p className="text-text font-semibold">{mySpace(titleKey)}</p>
      <p className="max-w-60 text-sm text-text-muted">
        {mySpace(messageKey)}
      </p>
    </div>
  );
}