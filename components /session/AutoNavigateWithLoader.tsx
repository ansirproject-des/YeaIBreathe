"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "../ui/Backdrop";

type AutoNavigateWithLoaderProps = {
  to: string;
  delay?: number;
  children?: React.ReactNode;
};

export function AutoNavigateWithLoader({
  to,
  delay = 2000,
  children,
}: AutoNavigateWithLoaderProps) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(to);
    }, delay);

    return () => clearTimeout(timeout);
  }, [to, delay, router]);

  return <Backdrop showSpinner>{children}</Backdrop>;
}