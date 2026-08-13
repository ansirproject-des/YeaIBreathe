"use client";

import { Button } from "@/components /ui/Button";
import { ModalTrigger } from "@/components /ui/ModalTrigger";
import { IconButton } from "@/components /ui/IconButton";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export function InfoModal() {
  const home = useTranslations("home")
  return (
    <ModalTrigger
      trigger={(open) => (
        <IconButton
          variant="appGray"
          type="button"
          onClick={open}
        >
          <Info className="w-5 h-5" />
        </IconButton>
      )}
    >
      {(close) => (
        <>
        <div className="w-full mb-6">
          <h3 className="text-xl text-text font-bold">{home("info.modalTitle")}</h3>
          </div>

          <div className="mt-4 space-y-6 text-text">
            <ol className="list-decimal list-inside space-y-2">
              <li>{home("info.steps.chooseMood")}</li>
              <li>{home("info.steps.breathe")}</li>
              <li>{home("info.steps.reflect")}</li>
            </ol>

            <p>{home("info.message")}</p>
          </div>

          <div className="mt-10 text-sm space-y-2 text-text-muted">
            <p>
              {home("info.content")}
            </p>

            <Button
              variant="text"
              size="smText"
              type="button"
              className="underline"
              onClick={close}
            >
              {home("info.button")}
            </Button>
          </div>
        </>
      )}
    </ModalTrigger>
  );
}