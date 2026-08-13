type BorderVariant =
  | "app"
  | "surface"

type BorderProps = {
  className?: string;
  variant?: BorderVariant;
};

const variants: Record<BorderVariant, string> = {
  app: "text-app-gray-hover",
  surface: "text-divider-surface",
};

export function Border({
  className = "",
  variant = "app",
}: BorderProps) {
  return (
     <div
      aria-hidden="true"
      className={`
        w-full h-px
        ${variants[variant]}
        bg-[repeating-linear-gradient(to_right,currentColor_0_8px,transparent_8px_14px)]
        ${className}
      `}
    />
  );
}