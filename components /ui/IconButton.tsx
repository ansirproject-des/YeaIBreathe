type IconButtonVariant =
  | "appGray"
  | "surface"
  | "surfaceGray"
  | "primary"
  | "textMuted"
  | "text"
  | "danger"
  | "dangerSecondary"
  | "success"


type IconButtonSize =
  | "sm"
  | "default"
  | "fit"

type IconButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: IconButtonVariant,
    children?: React.ReactNode,
    size?: IconButtonSize,
  }

const variants: Record<IconButtonVariant, string> = {
  appGray: "bg-app-gray hover:bg-app-gray-hover",
  surface: "bg-surface hover:text-text/80 border-2 border-transparent",
  surfaceGray: "bg-surface-gray hover:bg-surface-gray-hover",
  primary: "bg-primary border-2 border-transparent",
  textMuted: "bg-transparent text-text-muted hover:text-text border-2 border-transparent",
  text: "bg-transparent text-text hover:text-text/80 border-2 border-transparent",
  danger: "bg-danger-muted text-danger hover:bg-danger-muted-hover border-2 border-transparent",
  dangerSecondary: "bg-surface text-danger hover:text-danger/80 border-2 border-transparent",
  success: "bg-success-muted text-success hover:bg-success-muted-hover border-2 border-transparent"
}


const sizes: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 text-sm rounded-lg",
  default: "h-12 w-12 text-base rounded-xl",
  fit: "h-fit w-fit rounded-lg"
};


  export function IconButton({
    variant = "surface",
    className = "",
    children,
    size = "default",
    ...props
  }: IconButtonProps) {
    return (

      <button
        className={`
        p-1

        flex
        items-center
        justify-center

        cursor-pointer
        transition-all
        duration-200

        disabled:opacity-40
        disabled:cursor-not-allowed
        
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        `}
        {...props} >
        {children}
      </button>
    );
}


