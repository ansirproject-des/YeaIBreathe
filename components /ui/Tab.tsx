"use client";

import { Info as InfoIcon } from "lucide-react";
import { IconButton } from "./IconButton";
import { Popover } from "./Popover";
import { ModalTrigger } from "./ModalTrigger";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

type TabVariant = "pill" | "outline" | "underline";
type TabSize = "sm" | "default";

type TabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TabVariant;
  size?: TabSize;
  active?: boolean;
  info?: boolean;
  infoContent?: React.ReactNode;
};

export function Tab({
  variant = "pill",
  size = "default",
  active = false,
  info = false,
  infoContent,
  className,
  children,
  ...props
}: TabProps) {
  const hasInfo = info && infoContent;
  const mySpace = useTranslations("mySpace");
  const common = useTranslations("common");

  const tabButton = (
    <button
      type="button"
      className={`
        inline-flex
        items-center
        justify-center
        cursor-pointer
        transition-colors
        duration-200

        disabled:opacity-40
        disabled:cursor-not-allowed
        font-medium

        ${
          size === "sm"
            ? "px-3 py-1 text-sm"
            : "px-4 py-2 text-base"
        }

        ${
          variant === "pill"
            ? `
                rounded-lg
                ${
                  active
                    ? "bg-primary text-text-inverse"
                    : "bg-surface text-text hover:text-text/80"
                }
              `
            : variant === "outline"
            ? hasInfo
              ? `
                  rounded-lg
                  border-0
                  bg-transparent
                  ${
                    active
                      ? "text-text"
                      : "text-text-muted hover:text-text"
                  }
                `
              : `
                  rounded-lg
                  border
                  ${
                    active
                      ? "border-transparent bg-surface-gray text-text"
                      : "border-surface-gray text-text-muted hover:text-text hover:border-surface-gray-hover"
                  }
                `
            : `
                rounded-none
                ${
                  active
                    ? "text-text"
                    : "text-text-muted hover:text-text"
                }
              `
        }

        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </button>
  );

  if (!hasInfo) {
    return tabButton;
  }

  return (
    <div
      className={`
        flex items-center rounded-lg border transition-colors duration-300
        ${
          active
            ? "border-transparent bg-surface-gray"
            : "border-surface-gray hover:border-surface-gray-hover"
        }
      `}
    >
      {tabButton}

      <div className="hidden sm:block">
        <Popover
          title={mySpace("posts.tab.allInfo.title")}
          body={infoContent}
        >
          <IconButton
            variant="textMuted"
            type="button"
            size="fit"
            aria-label="More information"
          >
            <InfoIcon className="w-4 h-4" />
          </IconButton>
        </Popover>
      </div>

      <div className="sm:hidden">
        <ModalTrigger
          trigger={(open) => (
            <IconButton
              variant="textMuted"
              type="button"
              size="fit"
              onClick={open}
              aria-label="More information"
            >
              <InfoIcon className="w-4 h-4" />
            </IconButton>
          )}
          footer={(close) => (
            <Button className="w-full" onClick={close}>
              {common("gotIt")}
            </Button>
          )}
        >
          {() => (
            <>
              <div className="w-full mb-4">
                <h3 className="text-xl text-text font-bold">
                  {mySpace("posts.tab.allInfo.title")}
                </h3>
              </div>

              {infoContent}
            </>
          )}
        </ModalTrigger>
      </div>
    </div>
  );
}