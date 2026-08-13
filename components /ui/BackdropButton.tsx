type ButtonVariant =
  | "primary"
  | "secondary"
  | "text"
  | "danger"
  | "custom";

type ButtonSize =
  | "sm"
  | "default"
  | "smText"

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-surface
    text-text
    border-2 border-transparent
    hover:text-text/85
  `,

  secondary: `
    bg-surface/16
    text-surface
    border-2 border-surface/14
    hover:border-surface/36
  `,

  text:
    `bg-transparent 
    text-surface/60
    hover:text-surface`,

  danger:
    `bg-danger-muted 
    text-danger
    hover:bg-danger-muted-hover`,

  custom:
    ""

};

const sizes: Record<ButtonSize, string> = {
  sm:
    "h-9 px-4 text-sm rounded-lg",
  smText:
    "py-1 text-sm",
  default:
    "h-12 px-6 text-base rounded-xl",
}



type BackdropButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function BackdropButton({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: BackdropButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      className={`
        group
        inline-flex
        items-center
        justify-center
        
        font-medium
        
        cursor-pointer

        transition-all
        duration-300

        disabled:opacity-40
        disabled:cursor-not-allowed

         ${variants[variant]}
         ${sizes[size]}
        ${className}
      `}
      {...props}
    />
  );
}