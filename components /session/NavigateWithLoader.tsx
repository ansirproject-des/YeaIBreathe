"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Backdrop } from "../ui/Backdrop";

type NavigateWithLoaderProps = {
  to: string,
  delay?: number,
  children: React.ReactNode,
  loadingChildren?: React.ReactNode,
  className?: string,
  onClick?: () => void,
};

export function NavigateWithLoader({
  to,
  delay = 2000,
  children,
  loadingChildren,
  className = "",
  onClick,
}: NavigateWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleClick() {
  onClick?.();        

  setIsLoading(true);

  setTimeout(() => {
    router.push(to);
  }, delay);
}

  if (isLoading) {
    return (
      <Backdrop showSpinner>
        {loadingChildren}
      </Backdrop>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}