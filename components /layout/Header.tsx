type HeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

export function Header({
  left,
  center,
  right,
  className,
  innerClassName,
}: HeaderProps) {
  return (
    <header
      className={`w-full flex items-center justify-between px-5 py-6 ${
        className ?? ""
      }`}
    >
      <div
        className={`relative w-full flex items-center justify-between ${
          innerClassName ?? ""
        }`}
      >
        {left}

        <div className="absolute left-1/2 -translate-x-1/2">
          {center}
        </div>

        {right}
      </div>
    </header>
  );
}