"use client";

import { useRef, useState } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  length?: number;
  label?: string,
};

export function OtpInput({
  value,
  label,
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  length = 6,
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm text-text">{label}</p>
      <input
        ref={inputRef}
        value={value}
        maxLength={length}
        autoFocus={autoFocus}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="one-time-code"
        className="absolute opacity-0 pointer-events-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, "");
          onChange(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit && value.length === length) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />

      <div
        className="flex gap-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {Array.from({ length }).map((_, index) => {
          const isActive = isFocused && index === value.length;

          return (
            <div
              key={index}
              className={`
                relative
                flex h-12 w-12 items-center justify-center

                rounded-xl
                border

                text-xl
                font-bold

                transition-colors

                ${
                  isActive
                    ? "border-primary bg-surface-midgray"
                    : "border-surface-midgray-hover bg-surface-midgray hover:bg-surface-midgray-hover"
                }
              `}
            >
              <span>{value[index]}</span>

              {isActive && value[index] === undefined && (
                <div className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-primary animate-caret" />
              )}
            </div>
          );
        })}
      </div>
      </div>
  );
}