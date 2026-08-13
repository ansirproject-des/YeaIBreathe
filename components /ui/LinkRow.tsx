"use client"

import { Link, X } from "lucide-react";
import { IconButton } from "./IconButton";
import { Border } from "./Border";
import { removeProfileLink } from "@/app/actions/user";
import Linkify from "linkify-react";

type LinkRowProps = {
  id: string;
  title?: string;
  url: string;
  showBorder?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export function LinkRow({ id, title, url, showBorder, showRemoveButton, onRemove }: LinkRowProps) {

  async function handleRemove() {
  const result = await removeProfileLink(id);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  onRemove?.();
}
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <div className="bg- size-12 flex items-center justify-center rounded-xl">
            <Link className="w-5 h-5" />
          </div>

          <div>
            {title && (
              <p className="font-medium">{title}</p>
            )}
            <p className="text-text-muted">
              <Linkify
              options={{
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "text-primary hover:opacity-80 break-all",
              }}
            >
              {url}
            </Linkify>
              </p>
          </div>
        </div>
        {showRemoveButton &&
          <IconButton variant="textMuted" size="fit" onClick={handleRemove}>
            <X className="w-5 h-5" />
          </IconButton>
        }
      </div>

      {showBorder && (
        <Border variant="app" />
      )}
    </div>
  )
}