export type SessionBadgeVariants = 
| "better"
| "stillStressed"
| "same"
| "Box4444"
| "478"


const variants: Record<SessionBadgeVariants, { className: string }> = {
  better: {
    className: "text-sm text-success bg-success-muted border border-dashed border-success hover:bg-success-muted-hover transition-all"
  },
  stillStressed: {
    className: "text-sm text-danger bg-danger-muted border border-dashed border-danger hover:bg-danger-muted-hover transition-all"
  },
  same:  {
    className: "text-sm text-neutral bg-neutral-muted border border-dashed border-neutral hover:bg-neutral-muted-hover transition-all"
  },
  "Box4444": {
    className: "text-sm text-text bg-app-bg hover:bg-app-gray transition-all"
  },
  "478": {
    className: "text-sm text-text bg-app-bg hover:bg-app-gray transition-all"
  }
};

type SessionBadgeProps = {
  variant: SessionBadgeVariants;
  children: React.ReactNode;
  onClick?: () => void;
};

export function SessionBadge({
  variant, 
  onClick, 
  children
} : SessionBadgeProps) {

  const badge = variants[variant];

  return (
  <span
  className={`inline-flex items-center justify-center py-0.5 px-2 text-sm font-medium rounded-md cursor-pointer ${badge.className}`}
  onClick={onClick}
  >
    {children}
  </span>
);
}