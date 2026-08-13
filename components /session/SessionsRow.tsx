import { ChevronRight } from "lucide-react"
import { Border } from "../ui/Border"
import { SessionBadge } from "./SessionBadge"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl";
import { getCheckInBadgeKey, getCheckInBadgeVariant, getTechBadgeKey } from "@/lib/session/session";

type SessionsRowProps = {
  id: string;
  time: string;
  notes?: string;
  checkIn?: "better" | "same" | "tense";
  tech?: "Box4444" | "478";
  showBorder?: boolean;
};

export function SessionsRow({
  id,
  time,
  notes,
  checkIn,
  tech,
  showBorder = true,
}: SessionsRowProps) {
  const router = useRouter();
  const session = useTranslations("session.history")


  return (
    <div className="w-full flex flex-col gap-4">

      <button
        type="button"
        className="group w-full cursor-pointer"
        onClick={() => router.push(`/my-space/session/${id}`)}
      >
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex justify-between ">
            <div className="w-full flex flex-col items-start gap-1">
              <div className="text-text-muted text-sm font-medium">
                <p>{time}</p>
              </div>

              <div className="text-text pb-6">
                <p>{notes || session("notes")}</p>
              </div>

            </div>

            <ChevronRight
              className="
          w-5 h-5
          text-text-muted
          transition-colors
          group-hover:text-text
        "
            />
          </div>

          {(checkIn || tech) && (
            <div className="w-full flex gap-2">
              {checkIn && (
                <SessionBadge variant={getCheckInBadgeVariant(checkIn)}>
                  {session(`badges.${getCheckInBadgeKey(checkIn)}`)}
                </SessionBadge>
              )}
              {tech && (
                <SessionBadge variant={tech}>
                  {session(`badges.${getTechBadgeKey(tech)}`)}
                </SessionBadge>
              )}
            </div>
          )}

        </div>
      </button>

      {showBorder && (
        <Border variant="surface" />
      )}


    </div>
  )
}