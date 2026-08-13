"use client";

import { useEffect, useState } from "react";

export function MediaPreview({ file }: { file: File }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = () => {
      setSrc(reader.result as string);
    };

    reader.readAsDataURL(file);
  }, [file]);

  if (!src) return null;

  return file.type.startsWith("image/") ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={file.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <video
      src={src}
      className="h-full w-full object-cover"
      controls
    />
  );
}