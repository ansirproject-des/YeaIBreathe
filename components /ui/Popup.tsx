type PopupProps = {
  message?: string,
  variant?: "default" | "success" | "failure",
}

const variants = {
  default: "bg-primary text-text-inverse",
  success: "bg-success-muted text-success",
  failure: "bg-danger-muted text-danger",
};

export function Popup({ message, variant = "default" }: PopupProps) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 z-60
        rounded-xl px-4 py-3 text-sm shadow-xl
        animate-modal-in
        ${variants[variant]}
      `}
    >
      {message}
    </div>
  );
}