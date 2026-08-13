"use client";

import { SurfaceCard } from "../ui/SurfaceCard";
import { SettingsRow } from "../settings/SettingsRow";
import { PreferredModeModal } from "./PreferredModeModal";
import { PreferredLanguageModal } from "./PreferredLanguageModal";
import { useLocale, useTranslations } from "next-intl";

export function PreferencesCard() {
  const locale  = useLocale()
  const mySpace = useTranslations("mySpace.menu.settings.preferences");

  return (
    <SurfaceCard label={mySpace("title")}>
      <PreferredModeModal
        trigger={(open) => (
          <SettingsRow
            title={mySpace("mode.label")}
            value={mySpace("mode.light")}
            onClick={open}
          />
        )}
      />

      <PreferredLanguageModal
        trigger={(open) => (
          <SettingsRow
            title={mySpace("language.label")}
            value={mySpace(`language.options.${locale}.title`)}
            showBorder={false}
            onClick={open}
          />
        )}
      />
    </SurfaceCard>
  );
}