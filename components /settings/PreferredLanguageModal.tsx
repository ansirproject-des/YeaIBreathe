"use client"

import { ModalTrigger } from "../ui/ModalTrigger";
import { SettingsRow } from "../settings/SettingsRow";
import { updatePreferredLanguage } from "@/app/actions/user";
import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { MessageWrapper } from "../ui/MessageWrapper";

const languages = [
  { locale: "en" },
  { locale: "uk" },
] as const;

type PreferredLanguageModalProps = {
  trigger: (open: () => void) => React.ReactNode,
}

export function PreferredLanguageModal({ trigger }: PreferredLanguageModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const mySpace = useTranslations("mySpace.menu.settings.preferences.language");

  async function handleLanguageChange(locale: Locale, close: () => void) {
    const result = await updatePreferredLanguage({ locale })

    if (result.success) {
      router.refresh();
      close();
    }
  }

  return (

    <ModalTrigger
      trigger={trigger}
    >

      {(close) => (
        <>
          <div className="w-full mb-6">
            <h3 className="text-xl text-text font-bold">{mySpace("modalTitle")}</h3>
          </div>

          <MessageWrapper
            message="Choose the language you’d like to use throughout the app."
          >
            <div className="w-full flex flex-col gap-4 bg-surface p-4 rounded-[14px]">
              {languages.map((language, index) => {
                const isSelected = language.locale === locale;

                return (
                  <SettingsRow
                    key={language.locale}
                    title={mySpace(`options.${language.locale}.title`)}
                    content={mySpace(`options.${language.locale}.content`)}
                    borderVariant="app"
                    showBorder={index !== languages.length - 1}
                    rightIcon={isSelected ? "check" : "none"}
                    onClick={() => handleLanguageChange(language.locale, close)}
                  />
                )
              })}
            </div>
          </MessageWrapper>
        </>
      )}

    </ModalTrigger>

  )
}