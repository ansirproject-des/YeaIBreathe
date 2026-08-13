"use client"

import { Button } from "@/components /ui/Button";
import { IconButton } from "@/components /ui/IconButton";
import { ModalTrigger } from "@/components /ui/ModalTrigger";
import { Popover } from "@/components /ui/Popover";
import { FilePlusCorner, Images, Music } from "lucide-react";
import { useTranslations } from "next-intl";

type AttachmentToolbarProps = {
  onMediaClick: () => void;
  onAudioClick: () => void;
  onFileClick: () => void;
};

export function AttachmentToolbar({
  onMediaClick,
  onAudioClick,
  onFileClick,
}: AttachmentToolbarProps) {
  const mySpace = useTranslations("mySpace");
  return (
    <>
      <div className="w-fit flex gap-2 p-px rounded-lg border-[1.5px] border-dashed border-app-gray hover:border-app-gray-hover">
        <IconButton
          variant="text"
          size="fit"
          onClick={onMediaClick}
        >
          <Images className="w-5 h-5" />
        </IconButton>

        <IconButton
          variant="text"
          size="fit"
          onClick={onAudioClick}
        >
          <Music className="w-5 h-5" />
        </IconButton>

        <div className="hidden sm:block">
          <Popover
            title={mySpace("posts.create.attachments.info.select")}
            body={
              <p className="text-sm">
                {mySpace("posts.create.attachments.info.message1")}
                <br />
                {mySpace("posts.create.attachments.info.message2")}
              </p>
            }
          >
            <IconButton
              variant="text"
              size="fit"
              onClick={onFileClick}
            >
              <FilePlusCorner className="w-5 h-5" />
            </IconButton>
          </Popover>
        </div>

        <div className="sm:hidden">
          <ModalTrigger
            zIndex="z-[60]"
            trigger={(open) => (
              <IconButton
                variant="text"
                size="fit"
                onClick={open}
              >
                <FilePlusCorner className="h-5 w-5" />
              </IconButton>
            )}
            footer={() => (
              <Button onClick={onFileClick} className="w-full">{mySpace("posts.create.attachments.info.select")}</Button>
            )}
          >
            {() => (
              <>
                <div className="w-full mb-4">
                  <h3 className="text-xl text-text font-bold">{mySpace("posts.create.attachments.info.title")}</h3>
                </div>

                <p className="text-sm">
                  {mySpace("posts.create.attachments.info.message1")}
                  <br />
                  {mySpace("posts.create.attachments.info.message2")}
                </p>
              </>
            )}
          </ModalTrigger>
        </div>
      </div>
    </>
  )
}