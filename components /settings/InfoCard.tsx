"use client"

import { useTranslations } from "next-intl"
import { SurfaceCard } from "../ui/SurfaceCard"
import { SettingsRow } from "./SettingsRow"

export function InfoCard() {
  const mySpace = useTranslations("mySpace.menu.settings.info")
  return (
    <SurfaceCard>
      <SettingsRow title={mySpace("howWorks.label")} />
      <SettingsRow title={mySpace("sources.label")} />
      <SettingsRow
        title={mySpace("whenHelp.label")}
        showBorder={false}
      />
    </SurfaceCard>
  )
}