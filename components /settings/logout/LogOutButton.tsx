"use client"

import { Button } from "@/components /ui/Button"
import { LogOutModal } from "./LogOutModal"
import { useTranslations } from "next-intl"


export function LogOutButton() {
  const mySpace = useTranslations("mySpace")
  return (
    <LogOutModal
      trigger={(open) => (
        <Button
        variant="dangerSecondary"
        onClick={open}
        >
          {mySpace("menu.settings.logout.label")}
        </Button>
      )}
    />
  )
}