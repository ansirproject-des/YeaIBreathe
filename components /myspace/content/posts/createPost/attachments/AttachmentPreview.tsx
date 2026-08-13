"use client";

import { IconButton } from "@/components /ui/IconButton";
import { MediaPreview } from "@/components /ui/MediaPreview";
import { File, Music, X } from "lucide-react";
import { useTranslations } from "next-intl";

type AttachmentPreviewProps = {
  media: File[];
  setMedia: React.Dispatch<React.SetStateAction<File[]>>;

  audio: File[];
  setAudio: React.Dispatch<React.SetStateAction<File[]>>;

  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export function AttachmentPreview({
  media,
  setMedia,
  audio,
  setAudio,
  files,
  setFiles,
}: AttachmentPreviewProps) {
  const mySpace = useTranslations("mySpace");
  return (
    <>
      {media.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
          {media.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl"
            >
              <MediaPreview file={file} />

              <IconButton
                variant="surfaceGray"
                size="fit"
                className="absolute top-2 right-2"
                onClick={() =>
                  setMedia((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
        </div>
      )}

      {audio.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {audio.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl bg-app-gray p-3"
            >
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <span className="truncate">{file.name}</span>
              </div>

              <IconButton
                variant="text"
                size="fit"
                onClick={() =>
                  setAudio((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <X className="h-4 w-4 text-text-muted hover:text-text" />
              </IconButton>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl bg-app-gray p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <File className="h-5 w-5 shrink-0" />

                <div className="min-w-0">
                  <p className="truncate text-sm">{file.name}</p>

                  <p className="text-xs text-text-muted">
                    {(file.size / 1024 / 1024).toFixed(1)} {mySpace("posts.create.attachments.mb")}
                  </p>
                </div>
              </div>

              <IconButton
                variant="text"
                size="fit"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <X className="h-4 w-4 text-text-muted hover:text-text" />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </>
  );
}