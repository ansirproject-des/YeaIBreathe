import { AlertModalRef } from "@/components /ui/AlertModal";
import { validateAttachment } from "@/lib/post/attachments";
import { uploadFile } from "@/lib/post/upload";
import { useRef, useState } from "react";

export function useAttachments() {
  const [media, setMedia] = useState<File[]>([]);
  const [audio, setAudio] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const alertRef = useRef<AlertModalRef>(null);

  const config = {
    media: {
      setter: setMedia,
      limit: 6,
      errorTitle: "Some media couldn't be added",
    },
    audio: {
      setter: setAudio,
      limit: 1,
      errorTitle: "Some audio files couldn't be added",
    },
    document: {
      setter: setFiles,
      limit: 1,
      errorTitle: "Some files couldn't be added",
    },
  };

  function handleAttachmentSelect(
    event: React.ChangeEvent<HTMLInputElement>,
    attachmentType: "media" | "audio" | "document"
  ) {
    const current = config[attachmentType];
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      const result = validateAttachment(file, attachmentType);

      if (!result.valid) {
        errors.push(result.message ?? "Invalid file");
        continue;
      }

      validFiles.push(file);
    }

    current.setter((prev) =>
      [...prev, ...validFiles].slice(0, current.limit)
    );

    if (errors.length > 0) {
      alertRef.current?.open(
        current.errorTitle,
        errors.join("\n")
      );
    }

    event.target.value = "";
  }

  const handleMediaSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => handleAttachmentSelect(event, "media");

  const handleAudioSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => handleAttachmentSelect(event, "audio");

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => handleAttachmentSelect(event, "document");

  async function uploadAttachments() {
    const uploadedMedia = await Promise.all(
      media.map(async (file) => ({
        type: "media",
        key: await uploadFile(file),
        fileName: file.name,
      }))
    );

    const uploadedAudio = await Promise.all(
      audio.map(async (file) => ({
        type: "audio",
        key: await uploadFile(file),
        fileName: file.name,
      }))
    );

    const uploadedFiles = await Promise.all(
      files.map(async (file) => ({
        type: "document",
        key: await uploadFile(file),
        fileName: file.name,
      }))
    );

    return [
      ...uploadedMedia,
      ...uploadedAudio,
      ...uploadedFiles,
    ];
  }

  function clearAttachments() {
    setMedia([]);
    setAudio([]);
    setFiles([]);

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }

    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return {
    state: {
      media,
      audio,
      files,

      setMedia,
      setAudio,
      setFiles,
    },

    mediaInputRef,
    audioInputRef,
    fileInputRef,

    alertRef,

    handlers: {
      onMediaChange: handleMediaSelect,
      onAudioChange: handleAudioSelect,
      onFileChange: handleFileSelect,
    },

    uploadAttachments,
    clearAttachments,
  };
}