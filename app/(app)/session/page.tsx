import { Header } from "@/components /layout/Header";
import { ReadyButton } from "@/components /session/ReadyButton";
import { BackButton } from "@/components /session/BackButton";
import { ArrowLeft } from "lucide-react";
import Image from "next/image"
import { sessionTechs } from "@/data/sessionTechs";
import { iconMapSession } from "@/lib/session/iconMapSession";
import { getTranslations } from "next-intl/server";


type SessionProps = {
  searchParams: Promise<{
    mood?: string,
    tech?: string,
  }>
}

export default async function Session({ searchParams }: SessionProps) {
  const session = await getTranslations("session.steps.step1");
  const common = await getTranslations("common");

  const { mood, tech } = await searchParams;
  const config =
    tech === "breathing_478"
      ? sessionTechs.breathing_478
      : sessionTechs.box_4444;

  return (
    <>
      <div className="w-full flex flex-col items-center sm:gap-6 shrink-0">
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

        <div className="w-full px-5 pt-4 border-t-[1.5px] border-divider-surface">
          <div className="w-full max-w-170 mx-auto">

            <div className="w-full max-w-140 mx-auto text-text-muted font-medium text-sm mb-4">
              <p>{session("label")}</p>
            </div>

            <div className="w-full max-w-140 mx-auto flex justify-between">
              <div className="w-full flex flex-col items-start gap-0.5">
                <h4 className="font-bold text-text">
                  {session(config.titleKey)}
                </h4>
                <p className="text-text-muted">
                  {session(config.subtitleKey)}
                </p>
              </div>

              <div className="w-12" />
            </div>
          </div>
        </div>
      </div>

      <main className="w-full flex-1 overflow-y-auto hide-scrollbar">
        <div className="w-full px-5">
          <div className="w-full max-w-170 mx-auto">
            <div className="w-full max-w-140 mx-auto flex flex-col mt-12 gap-6">

              {config.steps.map((step, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col gap-2.5"
                >
                  <div className="w-full flex">
                    <div className="w-full flex">
                      {step.icons.map((iconName, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-center w-9 aspect-square ${config.theme.iconColor} rounded-lg`}
                        >
                            <Image
                              src={iconMapSession[iconName]}
                              alt=""
                              width={18}
                              height={18}
                            />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-8">
                    {step.paragraphs.map((paragraph, i) => (
                      <p key={i} className="text-text">
                        {session(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 px-5 pt-4 border-t-[1.5px] border-divider-surface">
        <div className="w-full max-w-140 mx-auto mb-12 sm:mb-14">
          <ReadyButton mood={mood} tech={tech} buttonColor={config.theme.buttonColor}/>
        </div>
      </footer>
    </>
  );
}