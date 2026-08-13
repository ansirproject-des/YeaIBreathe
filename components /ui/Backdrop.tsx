"use client";

import { Spinner } from "./Spinner";

type BackdropProps = {
  children?: React.ReactNode,
  showSpinner?: boolean,
};

export function Backdrop({ children, showSpinner = false }: BackdropProps) {

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-[3px]">
      <div className="flex flex-col items-center gap-2">
        {showSpinner && (
          <Spinner className="w-4 scale-170"/>
        )}

        <div className="flex flex-col items-center gap-2 text-center text-surface">
          {children}
        </div>
      </div>
    </div>
  );
} 