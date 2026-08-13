"use client";

import { NavigateWithLoader } from "./NavigateWithLoader";

type BackButtonProps = {
  href: string,
  children: React.ReactNode,
  loadingChildren?: React.ReactNode,
  delay?: number,
};

export function BackButton({
  href,
  children,
  loadingChildren,
  delay = 400,
}: BackButtonProps) {
  return (
    <NavigateWithLoader
      to={href}
      delay={delay}
      loadingChildren={loadingChildren}
      className="inline-flex items-center gap-2 text-text font-medium hover:text-text/80 h-12 px-3 rounded-xl whitespace-nowrap cursor-pointer"
    >
      {children}
    </NavigateWithLoader>
  );
}