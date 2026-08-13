"use client"



type SurfaceCardProps = {
  children: React.ReactNode,
  className?: string,
  label?: string,
  defaultBg?: boolean,
  defaultPadding?: boolean,
}

export function SurfaceCard({
  children,
  className = "",
  label,
  defaultBg = true,
  defaultPadding = true,
}: SurfaceCardProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <p className="text-sm font-medium text-text">{label}</p>
      )}

      <div className={`w-full flex flex-col ${defaultBg ? "bg-surface" : ""}
      ${defaultPadding ? "p-4 sm:p-5" : ""} gap-4 rounded-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}