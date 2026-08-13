import { Header } from "@/components /layout/Header";
import { BackButton } from "@/components /session/BackButton";
import { ArrowLeft } from "lucide-react";
import { SessionDetails } from "@/components /session/SessionDetails";
import { getTranslations } from "next-intl/server";


type SessionPageProps = {
  params: Promise<{
    id: string,
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const mySpace = await getTranslations("mySpace.menu");
  const common = await getTranslations("common")

  return (
    <>
      <div className="w-full shrink-0">
        <Header
          left={
            <BackButton
              href="/my-space/last-sessions"
              loadingChildren={
                <>
                  <p className="text-sm">{common("loading.label")}</p>
                  <p className="text-base">{common("loading.returning")}</p>
                </>
              }
            >
              <ArrowLeft className="w-5 h-5" /><span>{mySpace("lastSessions.label")}</span>
            </BackButton>
          }

          className="justify-center"
          innerClassName="w-full max-w-200" />
      </div>


     <SessionDetails sessionId={id}/>

    </>
  )
}