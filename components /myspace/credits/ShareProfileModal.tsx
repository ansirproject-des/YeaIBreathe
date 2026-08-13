"use client"

import { Button } from "@/components /ui/Button"
import { CopyButton } from "@/components /ui/CopyButton";
import { Input } from "@/components /ui/Input";
import { ModalTrigger } from "@/components /ui/ModalTrigger"
import { SocialButton } from "@/components /ui/SocialButton";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl"

type ShareProfileModalProps = {
  username: string,
}

export function ShareProfileModal({ username }: ShareProfileModalProps) {
  const mySpace = useTranslations("mySpace");

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${username}`
      : "";

  return (
    <ModalTrigger
      trigger={(open) => (
        <Button
          variant="secondaryGray"
          size="sm"
          onClick={open}
          className="w-full flex gap-2"
        >
          <Share2 className="w-4 h-4" />
          {mySpace("share.button")}
        </Button>
      )}
    >
      {() => (
        <>
          <div className="w-full mb-6">
            <h3 className="text-xl text-text font-bold">{mySpace("share.modalTitle")}</h3>
          </div>

          <div className="flex flex-col w-full gap-8">
            <p>
              {mySpace("share.modalSubtitle")}
            </p>
            <Input
              readOnly
              label={mySpace("share.shareInput")}
              value={profileUrl}
              variant="app"
              endAdornment={
                <CopyButton text={profileUrl} />
              }
            />

            <div className="flex flex-col gap-4">
              <p className="w-full font-bold">{mySpace("share.shareButton")}</p>
              <div className="w-full flex gap-4 overflow-x-auto hide-scrollbar">
                <SocialButton
                  url={profileUrl}
                  title={`Check out @${username}'s profile!`}
                />
              </div>
            </div>

          </div>
        </>
      )}
    </ModalTrigger>
  )
}
