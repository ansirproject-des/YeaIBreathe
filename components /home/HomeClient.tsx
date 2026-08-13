"use client"

import { Header } from "@/components /layout/Header"
import { MySpaceButton } from "@/components /myspace/MySpaceButton"
import { InfoModal } from "@/components /home/InfoModal"
import { MoodTypes } from "@/components /session/MoodTypes"
import { useState } from "react"
import { Mood } from "@/data/session/moods"
import { ResumeSessionBanner } from "@/components /session/ResumeSessionBanner"
import { StartSessionButton } from "@/components /session/StartSessionButton"
import { getCurrentDbUser } from "@/lib/user/user"
import { OnboardingModal } from "../onboarding/OnboardingModal"

type HomeClientProps = {
  user: Awaited<ReturnType<typeof getCurrentDbUser>>;
}

export default function HomeClient({ user }: HomeClientProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [onboardingOpen, setOnboardingOpen] = useState(!user.onboardingCompleted)


  return (
    <>
      {onboardingOpen && (
       <OnboardingModal onCompleted={() => setOnboardingOpen(false)}/>
      )}
      <div className="w-full shrink-0">
        <Header
          left={<MySpaceButton user={user} />}
          right={<InfoModal />}
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>

      <main className="w-full max-w-170 flex-1 overflow-y-auto px-5 hide-scrollbar">
        <div className="w-full mt-8">
          <MoodTypes
            user={user}
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
        </div>


      </main>

      <footer className="w-full shrink-0 px-5 pt-4 border-t border-app-gray">
        <div className="w-full max-w-140 mx-auto mb-12 sm:mb-14 gap-4 flex flex-col items-center">
          <ResumeSessionBanner />

          <StartSessionButton selectedMood={selectedMood} />
        </div>
      </footer>
    </>
  )
}