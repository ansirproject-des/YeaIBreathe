"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  zIndex?: string;
};

export function Modal({
  isOpen,
  onClose,
  children,
  footer,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
  contentClassName = "p-4 sm:p-6",
  zIndex = "z-50",
}: ModalProps) {
  const common = useTranslations("common");

  const [mounted, setMounted] = useState(false);

  // Mount only on client
  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (!mounted || !isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, isOpen]);

  // Prevent SSR + hydration mismatch
  if (!mounted || !isOpen) {
    return null;
  }

  const footerContent =
    footer ??
    (showCloseButton ? (
      <Button
        variant="text"
        size="smText"
        onClick={onClose}
        type="button"
      >
        {common("close")}
      </Button>
    ) : null);

  return createPortal(
    <div
      className={`
        fixed inset-0
        ${zIndex}
        flex
        items-end
        sm:items-center
        justify-center
        bg-primary/60
        p-2
        sm:p-4
      `}
      onClick={() => {
        if (closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <div
        className={`
          relative
          w-full
          max-h-160
          rounded-3xl
          bg-app-bg
          shadow-xl
          flex
          flex-col
          overflow-hidden
          animate-modal-in
          cursor-default
          max-w-lg
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`
            relative
            z-10
            flex-1
            overflow-y-auto
            hide-scrollbar
            ${contentClassName}
          `}
        >
          {children}
        </div>

        {footerContent && (
          <div
            className="
              relative
              z-10
              shrink-0
              p-4
              sm:p-6
              flex
              justify-end
            "
          >
            {footerContent}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}