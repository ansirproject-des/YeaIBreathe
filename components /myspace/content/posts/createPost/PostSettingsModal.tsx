"use client"

import { Button } from "@/components /ui/Button"
import { ModalTrigger } from "@/components /ui/ModalTrigger"
import { ChevronDown, } from "lucide-react"
import { SettingsRow } from "@/components /settings/SettingsRow"
import { MessageWrapper } from "@/components /ui/MessageWrapper"
import { type PostSettings } from "@/lib/types"
import { useTranslations } from "next-intl"


type PostSettingsModalProps = {
  settings: PostSettings;
  setSettings: React.Dispatch<React.SetStateAction<PostSettings>>;
};

export function PostSettingsModal({ settings, setSettings }: PostSettingsModalProps) {
  const mySpace = useTranslations("mySpace");

  return (
    <>
      <ModalTrigger
        trigger={(open) => (
          <Button
            variant="text"
            size="defaultText"
            className="gap-1 group"
            onClick={open}
          >
            {mySpace("posts.create.postSettings.label")}<ChevronDown className="w-5 h-5 text-text-muted transition-colors group-hover:text-text" />
          </Button>
        )}
      >
        {() => (
          <>
            <div className="w-full mb-6">
              <h3 className="text-xl text-text font-bold">{mySpace("posts.create.postSettings.modalTitle")}</h3>
            </div>

            <MessageWrapper
              message={mySpace("posts.create.postSettings.postSettingsHint")}
            >
              <div className="w-full flex flex-col gap-4 bg-surface p-4 rounded-[14px]">

                <SettingsRow
                  title={mySpace("posts.create.postSettings.view")}
                  value={
                    settings.visibility === "anyone"
                      ?  mySpace("posts.create.postSettings.anyone")
                      : mySpace("posts.create.postSettings.followers_only")
                  }
                  rightIcon="none"
                  borderVariant="app"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      visibility:
                        prev.visibility === "anyone"
                          ? "followers_only"
                          : "anyone",
                    }))
                  }
                />

                <SettingsRow
                  title={mySpace("posts.create.postSettings.comment")}
                  value={
                    settings.commentPermission === "anyone"
                      ? mySpace("posts.create.postSettings.anyone")
                      : mySpace("posts.create.postSettings.followers_only")
                  }
                  rightIcon="none"
                  borderVariant="app"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      commentPermission:
                        prev.commentPermission === "anyone"
                          ? "followers_only"
                          : "anyone",
                    }))
                  }
                />

                <SettingsRow
                  title={mySpace("posts.create.postSettings.postAs")}
                  value={
                    settings.authorType === "public"
                      ? mySpace("posts.create.postSettings.public")
                      : mySpace("posts.create.postSettings.anon")
                  }
                  rightIcon="none"
                  borderVariant="app"
                  showBorder={false}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      authorType:
                        prev.authorType === "public"
                          ? "anonymous"
                          : "public",
                    }))
                  }
                />

              </div>
            </MessageWrapper>
          </>
        )}
      </ModalTrigger>
    </>
  )
}