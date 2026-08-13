import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "app" | "surface",
  label?: string,
  className?: string,

  adornment?: React.ReactNode,
  endAdornment?: React.ReactNode,

  fullWidth?: boolean,
  containerClassName?: string,

  helperText?: string,
  helperVariant?: "default" | "success" | "error",
  helperIcon?: React.ReactNode,
  helperIndicator?: boolean,
};

const helperVariants = {
  default: "text-text",
  success: "text-success",
  error: "text-danger",
};

const indicatorColor = {
  success: "bg-success",
  error: "bg-danger",
} as const;

export function Input({
  className,
  label,
  value,
  placeholder,
  adornment,
  endAdornment,
  onChange,
  maxLength,
  onKeyDown,
  helperText,
  helperVariant = "default",
  helperIcon,
  fullWidth = true,
  containerClassName = "",
  autoFocus = false,
  variant = "surface",
  helperIndicator,
  ...props
}: InputProps) {
  const isError = helperVariant === "error";
  const isReadOnly = props.readOnly;
  const hasHelper = Boolean(helperText || helperIcon);

  return (
    <div
      className={`
        flex flex-col
        ${label ? "gap-2" : ""}
        ${fullWidth ? "flex-1 min-w-0" : "w-fit"}
      `}
    >
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-text"
        >
          {label}
        </label>
      )}

      <div
        className={`
          flex
          h-12
          items-center
          rounded-xl
          border
          transition-all
          duration-200
          ${containerClassName}

          ${variant === "surface"
            ? `
                bg-surface-midgray
                hover:bg-surface-midgray-hover
                disabled:hover:bg-surface-midgray
                ${isError
              ? "border-danger"
              : `
                border-surface-midgray-hover
                ${!isReadOnly ? "focus-within:border-primary" : ""}
                `
            }
              `
            : `
                bg-surface
                hover:border-surface-midgray-hover
                disabled:hover:bg-surface
                ${isError
              ? "border-danger"
              : `
              border-surface
              ${!isReadOnly ? "focus-within:border-primary" : ""}
              `
            }
              `
          }
        `}
      >
        {adornment && (
          <span className="shrink-0 pl-4 font-medium text-text-muted">
            {adornment}
          </span>
        )}

        <input
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          {...props}
          className={`
            h-full
            min-w-0
            flex-1
            bg-transparent
            px-4
            text-text
            placeholder:text-text-absent
            outline-none
            disabled:cursor-not-allowed
            disabled:text-text-muted
            ${className ?? ""}
          `}
        />

        {endAdornment && (
          <div className="shrink-0 pr-2">
            {endAdornment}
          </div>
        )}
      </div>

      {hasHelper && (
        <div
          className={`
            mt-0
            flex
            items-center
            gap-2
            px-2
            text-sm
            transition-all
            duration-200
            ${helperVariants[helperVariant]}
          `}
        >
          {helperIndicator &&
            helperVariant !== "default" && (
              <div className="relative overflow-visible">
                <div
                  className={`
          absolute left-0 top-0 size-2 rounded-full animate-helper-pulse
          ${indicatorColor[helperVariant]}
        `}
                />
                <div
                  className={`
          relative size-2 rounded-full
          ${indicatorColor[helperVariant]}
        `}
                />
              </div>
            )}

          {helperIcon}

          <span
            key={helperText}
            className="animate-helper-fade"
          >
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
}