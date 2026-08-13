"use client"

import { moods, type Mood } from "@/data/session/moods"
import { MoodButton } from "./MoodButton"
import { Border } from "../ui/Border"
import { getCurrentDbUser } from "@/lib/user/user"
import { useTranslations } from "next-intl"

type MoodTypesProps = {
  user: Awaited<ReturnType<typeof getCurrentDbUser>>;
  selectedMood: Mood | null
  onSelectMood: (mood: Mood) => void
}

export function MoodTypes({ user, selectedMood, onSelectMood }: MoodTypesProps) {
  const session = useTranslations("session")

  return (
    <div className="w-full max-w-140 mx-auto flex flex-col items-center gap-10">
      <h1 className="text-3xl font-bold text-text">
        {session("title")} {user.displayName}?
      </h1>

      <div className="w-full flex flex-col gap-2.5">
        {moods.map((mood, index) => (
          <div key={mood.id}>
            {index === moods.length - 1 && (

              <div className="mt-12 mb-4 px-4">
                <Border />
              </div>

            )}

            <MoodButton
              mood={mood}
              selected={selectedMood?.id === mood.id}
              onClick={() => onSelectMood(mood)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}