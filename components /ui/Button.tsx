type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondaryGray"
  | "text"
  | "danger"
  | "dangerSecondary"
  | "success"
  | "stressed"
  | "anxious"
  | "focus"
  | "custom";

type ButtonSize =
  | "sm"
  | "default"
  | "smText"
  | "defaultText"

const variants: Record<ButtonVariant, string> = {
  primary:
    `bg-primary 
    shadow-[inset_0px_0px_10px_4px_rgba(243,240,234,0.2)]
    text-text-inverse
    hover:shadow-[inset_0px_0px_0px_3px_rgba(243,240,234,0.2)]
    disabled:opacity-40
    `,

  secondary:
    `bg-surface 
    text-text
    border-2 border-transparent
    hover:text-text
    disabled:text-text-muted
    disabled:hover:bg-surface
    `,

  secondaryGray:
    `bg-app-gray 
    text-text
    border-2 border-transparent
    hover:bg-app-gray-hover
    disabled:text-text-muted
    disabled:hover:bg-app-gray
    `,

  text:
    `bg-transparent 
    text-text
    border-2 border-transparent
    hover:text-text/80
    disabled:opacity-40
    `,

  danger:
    `bg-danger-muted 
    text-danger
    border-2 border-transparent
    hover:bg-danger-muted-hover
    disabled:text-danger/60
    disabled:hover:bg-danger-muted
    `,

  dangerSecondary:
    `bg-surface 
    text-danger
    border-2 border-transparent
    hover:text-danger/80
    disabled:text-danger/60
    disabled:hover:bg-surface
    `,

  success:
    `bg-success-muted 
    text-success
    border-2 border-transparent
    hover:bg-success-muted-hover
    disabled:text-success/60
    disabled:hover:bg-success-muted
    `,

  stressed:
    `bg-stressed
    text-text-inverse
   
    shadow-[inset_0px_0px_10px_4px_rgba(243,240,234,0.2)]
    hover:shadow-[inset_0px_0px_0px_3px_rgba(243,240,234,0.2)]
    disabled:opacity-40
    `,

  anxious:
    `bg-anxious
    text-text-inverse
    
    shadow-[inset_0px_0px_10px_4px_rgba(243,240,234,0.2)]
    hover:shadow-[inset_0px_0px_0px_3px_rgba(243,240,234,0.2)]
    disabled:opacity-40
    `,

  focus:
    `bg-focus
    text-text-inverse
   
    shadow-[inset_0px_0px_10px_4px_rgba(243,240,234,0.2)]
    hover:shadow-[inset_0px_0px_0px_3px_rgba(243,240,234,0.2)]
    disabled:opacity-40
    `,

  custom:
    ""

};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  smText: "py-1 text-sm",
  default: "h-12 px-5 text-base rounded-xl",
  defaultText: "text-base"
};



type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
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

        
        disabled:cursor-not-allowed

         ${variants[variant]}
         ${sizes[size]}
        ${className}
      `}
      {...props}
    />
  );
}