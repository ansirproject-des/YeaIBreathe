"use client";

import { useRouter } from "next/navigation";
import { sessionTechs } from "@/data/sessionTechs";
import { useTranslations } from "next-intl";

type ButtonColor = (typeof sessionTechs)[keyof typeof sessionTechs]["theme"]["buttonColor"]

type ReadyButtonProps = {
  mood?: string,
  tech?: string,
  buttonColor: ButtonColor,
};

export function ReadyButton({ mood, tech, buttonColor }: ReadyButtonProps) {
  const router = useRouter();
  const session = useTranslations("session")

  function handleClick() {
    router.push(
      `/session/breathing?mood=${mood ?? "stressed"}&tech=${tech ?? "box_4444"}`
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full max-w-140 shadow-[inset_0px_0px_10px_4px_rgba(243,240,234,0.2)]
    text-text-inverse h-12 px-6 font-medium rounded-xl cursor-pointer transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[inset_0px_0px_0px_3px_rgba(243,240,234,0.2)] ${buttonColor}`}
    >
      {session("ready")}
    </button>
  );
}