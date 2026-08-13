"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/Button";

type SaveSessionButtonProps = {
  onClick: () => void;
};

export function SaveSessionButton({
  onClick,
}: SaveSessionButtonProps) {
  const session = useTranslations("session")
  return (
    <Button onClick={onClick}>
      {session("save")}
    </Button>
  );
}