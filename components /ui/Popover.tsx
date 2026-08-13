"use client";

import { useState } from "react";

const positions = {
  top: {
    start: "bottom-full left-0 mb-2",
    center: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    end: "bottom-full right-0 mb-0",

    hidden: "translate-y-2 opacity-0",
    shown: "translate-y-0 opacity-100",
  },

  bottom: {
    start: "top-full left-0 mt-2",
    center: "top-full left-1/2 -translate-x-1/2 mt-2",
    end: "top-full right-0 mt-0",

    hidden: "-translate-y-2 opacity-0",
    shown: "translate-y-0 opacity-100",
  },

  left: {
    start: "right-full top-0 mr-2",
    center: "right-full top-1/2 -translate-y-1/2 mr-2",
    end: "right-full bottom-0 mr-0",

    hidden: "translate-x-2 opacity-0",
    shown: "translate-x-0 opacity-100",
  },

  right: {
    start: "left-full top-0 ml-2",
    center: "left-full top-1/2 -translate-y-1/2 ml-2",
    end: "left-full bottom-0 ml-0",

    hidden: "-translate-x-2 opacity-0",
    shown: "translate-x-0 opacity-100",
  },
} as const;

const sizes = {
  default: "w-72",
  compact: "w-fit whitespace-nowrap",
} as const;

type PopoverPlacement = keyof typeof positions;
type PopoverAlign = "start" | "center" | "end";
type PopoverVariant = keyof typeof sizes;

type PopoverProps = {
  children: React.ReactNode;
  title?: string;
  body: React.ReactNode;
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  variant?: PopoverVariant;
};

export function Popover({
  children,
  title,
  body,
  placement = "top",
  align = "start",
  variant = "default",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const current = positions[placement];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <div
        className={`
          absolute z-10 transition-all duration-100
          ${current[align]}
          ${
            isOpen
              ? current.shown
              : `pointer-events-none ${current.hidden}`
          }
        `}
      >
        <div
          className={`
            flex flex-col gap-1 overflow-hidden rounded-xl
            border border-surface bg-app-bg/72 p-2
            shadow-sm backdrop-blur-xs
            ${sizes[variant]}
          `}
        >
          {title && (
            <p className="text-sm font-bold">
              {title}
            </p>
          )}

          <div
            className={
              variant === "compact"
                ? "whitespace-nowrap text-sm"
                : "whitespace-pre-line text-sm"
            }
          >
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}