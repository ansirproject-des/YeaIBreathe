"use client";

import { socialIcons, type SocialIcon } from "@/lib/user/iconMapSocials";
import Image from "next/image";

type SocialButtonProps = {
  url: string;
  title?: string;
};

export function SocialButton({ url, title }: SocialButtonProps) {
  async function handleClick(icon: SocialIcon) {
    if (icon.action === "native") {
      if (!navigator.share) {
        alert("Sharing is not supported on this device.");
        return;
      }

      await navigator.share({
        title: title ?? "Check this out",
        url,
      });

      return;
    }

    if (!icon.shareUrl) return;

    window.open(
      icon.shareUrl({ url, title }),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      {socialIcons.map(({ id, icon, shareUrl, action }) => (
        <div
          key={id}
          className="shrink-0 group flex flex-col gap-2 justify-center items-center"
        >
          <button
            onClick={() =>
              handleClick({
                id,
                icon,
                shareUrl,
                action,
              })
            }
            className="transition-transform hover:rotate-16 duration-200 p-4 bg-surface rounded-full cursor-pointer"
          >
            <Image
              src={icon}
              alt={id}
              width={32}
              height={32}
              className="hover:opacity-80"
            />
          </button>

          <p className="text-sm text-text-muted group-hover:text-text">
            {id}
          </p>
        </div>
      ))}
    </>
  );
}