type AvatarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function AvatarButton({
  children,
  className = "",
  ...props
}: AvatarButtonProps) {
  return (
    <button
      type="button"
      className={`
        bg-app-gray rounded-full p-1
        flex items-center justify-center
        cursor-pointer transition-all duration-200
        hover:bg-app-gray-hover hover:text-text/80
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}