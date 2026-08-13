"use client";

import { InfoIcon } from "lucide-react";

type Message = "default" | "error" | "success";
type HelperIcon = "info" | "indicator";

const indicatorColor = {
  success: "bg-success",
  error: "bg-danger",
} as const;

type MessageWrapperProps = {
  children: React.ReactNode;
  message: React.ReactNode;
  variant?: Message;
  helperIcon?: HelperIcon;
};

export function MessageWrapper({
  children,
  message,
  variant = "default",
  helperIcon = "info",
}: MessageWrapperProps) {
  return (
    <div
      className={`
        w-full rounded-2xl p-1
        ${
          variant === "error"
            ? "bg-danger/10"
            : variant === "success"
              ? "bg-success/10"
              : "bg-app-gray"
        }
      `}
    >
      {children}

      <div
        className={`
          flex gap-2 px-2 pt-3 pb-2 text-sm
          ${
            variant === "error"
              ? "text-danger"
              : variant === "success"
                ? "text-success"
                : "text-text-descr"
          }
        `}
      >
        {helperIcon === "info" ? (
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          helperIcon === "indicator" &&
          variant !== "default" && (
            <div className="relative mt-1 overflow-visible">
              <div
                className={`
                  absolute left-0 top-0 size-2 rounded-full
                  animate-helper-pulse
                  ${indicatorColor[variant]}
                `}
              />

              <div
                className={`
                  relative size-2 rounded-full
                  ${indicatorColor[variant]}
                `}
              />
            </div>
          )
        )}

        <span className="animate-helper-fade">
          {message}
        </span>
      </div>
    </div>
  );
}