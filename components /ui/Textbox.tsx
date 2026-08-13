"use client";

import { useEffect, useRef } from "react";

const helperVariants = {
  default: "text-text",
  success: "text-success",
  error: "text-danger",
} as const;

const indicatorColor = {
  success: "bg-success",
  error: "bg-danger",
} as const;

type TextboxProps = {
  value: string;
  onChange: (value: string) => void;

  placeholder: string;

  variant?: "default" | "post" | "title";
  maxLength?: number;
  autoResize?: boolean;

  autoFocus?: boolean;
  label?: string;

  helperText?: string;
  helperVariant?: "default" | "success" | "error";
  helperIndicator?: boolean;
  helperIcon?: React.ReactNode;
};

export function Textbox({
  value,
  onChange,
  placeholder,
  label,
  variant = "default",
  maxLength = 300,
  autoResize = false,
  autoFocus = false,

  helperText,
  helperVariant = "default",
  helperIndicator = false,
  helperIcon,
}: TextboxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isPost = variant === "post";
  const isTitle = variant === "title";

  const maxLengthError =
    value.length >= maxLength
      ? `Maximum ${maxLength} characters reached`
      : undefined;

  const currentHelper = maxLengthError ?? helperText;

  const currentVariant =
    maxLengthError
      ? "error"
      : helperVariant;

  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value, autoResize]);


  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(event.target.value);
  };

  return (
    <label className="flex w-full flex-col gap-2">
      {label && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}

      {isTitle ? (
        <input
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          aria-invalid={currentVariant === "error"}
          placeholder={placeholder}
          className="
            h-fit
            w-full
            border-none
            bg-transparent
            p-0
            text-2xl
            font-bold
            text-text
            placeholder:text-text-absent
            transition-all
            duration-200
            focus:outline-none
          "
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          autoFocus={autoFocus}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          aria-invalid={currentVariant === "error"}
          placeholder={placeholder}
          className={`
            w-full
            resize-none

            ${isPost
              ? `
                  border-none
                  bg-transparent
                  p-0
                  text-base
                `
              : `
                  h-60
                  rounded-2xl
                  border
                  bg-surface
                  px-4
                  py-3
                  text-base
                  hover:border-surface-midgray-hover
                `
            }

            text-text
            placeholder:text-text-absent
            hide-scrollbar
            transition-all
            duration-200
            focus:outline-none

            ${currentVariant === "error"
              ? "border-danger focus:border-danger"
              : "border-divider-surface focus:border-primary"
            }
          `}
        />
      )}

      {(currentHelper || helperIcon) && (
        <div
          className={`
            flex
            items-center
            gap-2
            px-2
            text-sm
            transition-all
            duration-200
            ${helperVariants[currentVariant]}
          `}
        >
          {helperIndicator &&
            currentVariant !== "default" && (
              <div className="relative overflow-visible">
                <div
                  className={`
                    absolute
                    left-0
                    top-0
                    size-2
                    rounded-full
                    animate-helper-pulse
                    ${indicatorColor[currentVariant]}
                  `}
                />

                <div
                  className={`
                    relative
                    size-2
                    rounded-full
                    ${indicatorColor[currentVariant]}
                  `}
                />
              </div>
            )}

          {helperIcon}

          <span
            key={currentHelper}
            className="animate-helper-fade"
          >
            {currentHelper}
          </span>
        </div>
      )}
    </label>
  );
}