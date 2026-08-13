import { Header } from "@/components /layout/Header";
import { BackButton } from "@/components /session/BackButton";
import { LastSessions } from "@/components /session/LastSessions";
import { ArrowLeft, } from "lucide-react";
import { getTranslations } from "next-intl/server";


export default async function LastSessionsPage() {
  const common = await getTranslations("common");
  const mySpace = await getTranslations("mySpace");

  return (
    <>
      <div className="w-full shrink-0">
        <Header
          left={
            <BackButton
              href="/home"
              loadingChildren={
                <>
                  <p className="text-sm">{common("loading.label")}</p>
                  <p className="text-base">{common("loading.returning")}</p>
                </>
              }
            >
              <ArrowLeft className="w-5 h-5" />
            </BackButton>
          }
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>

      <main className="w-full flex-1 overflow-y-auto px-5 hide-scrollbar">
        <div
          className="w-full max-w-170 mx-auto flex flex-col my-8 gap-10"
        >
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-3xl font-bold">{mySpace("menu.lastSessions.title")}</h2>
            <p className="text-text-muted">{mySpace("menu.lastSessions.subtitle")}</p>
          </div>
          <LastSessions />

        </div>
      </main>

    </>
  )
}