import { Check, ChevronRight } from "lucide-react"
import { Border } from "../ui/Border"

type SettingsRowVariant =
  | "default"
  | "danger"
  | "disabled"

type SettingsRowBorderVariant =
  | "surface"
  | "app"

type SettingsRowProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string,
  content?: string,
  value?: string | number,
  showBorder?: boolean,
  borderVariant?: SettingsRowBorderVariant,
  variant?: SettingsRowVariant,
  rightIcon?: "chevron" | "check" | "none",
}

const variants: Record<SettingsRowVariant, string> = {
  default: `
    text-text
    cursor-pointer
    hover:text-text/80
  `,

  danger: `
    text-danger
    cursor-pointer
    hover:text-danger/80
  `,

  disabled: `
    opacity-40
    cursor-not-allowed
  `,
};

export function SettingsRow({
  variant = "default",
  title,
  value,
  content,
  showBorder = true,
  borderVariant = "surface",
  rightIcon = "chevron",
  className = "",
  ...props
}: SettingsRowProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <button
        type="button"
        disabled={variant === "disabled" || props.disabled}
        className={`
        group w-full flex justify-between items-center text-left transition-all
        ${variants[variant]}
        ${className}
        `}
        {...props}
      >

        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          {content && (
            <p className="text-sm font-medium text-text-muted">
              {content}
              </p>
          )}
        </div>

        <div
          className="flex items-center justify-center gap-2 text-text-muted font-medium transition-colors group-hover:text-text">
          {value && <p>{value}</p>}

          {rightIcon === "chevron" && <ChevronRight className="w-5 h-5" />}
          {rightIcon === "check" && <Check className="w-5 h-5 text-text" />}
        </div>
      </button>

      {showBorder && (
        <Border variant={borderVariant} />
      )}
    </div>
  )
}