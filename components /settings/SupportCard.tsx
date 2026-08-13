"use client"

import { useTranslations } from "next-intl"
import { SurfaceCard } from "../ui/SurfaceCard"
import { SettingsRow } from "../settings/SettingsRow"

export function SupportCard() {
  const mySpace = useTranslations("mySpace.menu.settings.support")
  return (
    <SurfaceCard label={mySpace("title")}>
      <SettingsRow title={mySpace("contact.label")} />
      <SettingsRow title={mySpace("help.label")} />
      <SettingsRow title={mySpace("privacy.label")} showBorder={false} />
    </SurfaceCard>
  )
}