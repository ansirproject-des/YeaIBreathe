"use client"

import { useAttachments } from "@/hooks/useAttachments";

type AttachmentInputsProps = {
  mediaInputRef: React.RefObject<HTMLInputElement | null>;
  audioInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlers: ReturnType<typeof useAttachments>["handlers"];
};

export function AttachmentInputs({ mediaInputRef, audioInputRef, fileInputRef, handlers }: AttachmentInputsProps) {
  return (
    <>
      <input
        ref={mediaInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.mp4,.webm,.mov"
        multiple
        className="hidden"
        onChange={handlers.onMediaChange}
      />

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handlers.onAudioChange}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handlers.onFileChange}
      />

    </>
  )
}