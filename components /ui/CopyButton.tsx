"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  text: string,
}

export function CopyButton({text}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    window.prompt("Copy this link:", text);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg"
    >
      {copied ? (
        <Check className="size-4.5" />
      ) : (
        <Copy className="size-4.5 text-text-muted hover:text-text" />
      )}
    </button>
  );
}