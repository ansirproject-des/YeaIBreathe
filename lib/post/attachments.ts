export type AttachmentType =
  | "media"
  | "audio"
  | "document";

export const ATTACHMENT_LIMITS = {
  image: 8 * 1024 * 1024,      // 8 MB
  video: 100 * 1024 * 1024,    // 100 MB
  audio: 20 * 1024 * 1024,     // 20 MB
  document: 10 * 1024 * 1024,  // 10 MB
};

const allowedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",

  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const allowedAudioTypes = [
  "audio/mpeg",   
  "audio/mp4",    
  "audio/wav",
  "audio/webm",
  "audio/ogg",
];

const allowedDocumentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export function validateAttachment(
  file: File,
  expectedType: AttachmentType
) {
  if (
    expectedType === "media" &&
    !allowedMediaTypes.includes(file.type)
  ) {
    return {
      valid: false,
      title: "Unsupported media",
      message: `${file.name} is not a supported image or video format.`,
    };
  }

  if (
    expectedType === "audio" &&
    !allowedAudioTypes.includes(file.type)
  ) {
    return {
      valid: false,
      title: "Unsupported audio",
      message: `${file.name} is not a supported audio format.`,
    };
  }

  if (
    expectedType === "document" &&
    !allowedDocumentTypes.includes(file.type)
  ) {
    return {
      valid: false,
      title: "Unsupported document",
      message: `${file.name} is not a supported document format.`,
    };
  }

  let maxSize: number;

  if (expectedType === "media") {
    const mediaType = file.type.startsWith("image/")
      ? "image"
      : "video";

    maxSize = ATTACHMENT_LIMITS[mediaType];
  } else {
    maxSize = ATTACHMENT_LIMITS[expectedType];
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      title: `${expectedType[0].toUpperCase()}${expectedType.slice(1)} too large`,
      message: `${file.name} exceeds the ${
        maxSize / 1024 / 1024
      }MB limit.`,
    };
  }

  return {
    valid: true,
    title: null,
    message: null,
  };
}