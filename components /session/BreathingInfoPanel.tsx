import Image from "next/image";
import { iconMapSession } from "@/lib/session/iconMapSession";
import { sessionTechs } from "@/data/sessionTechs";
import { useTranslations } from "next-intl";

type IconName = keyof typeof iconMapSession;
type Theme = (typeof sessionTechs)[keyof typeof sessionTechs]["theme"]

type BreathingInfoPanelProps = {
  isOpen: boolean,
  theme: Theme,
  steps: readonly {
    icons: readonly IconName[],
    paragraphs: readonly string[],
  }[];
};

export function BreathingInfoPanel({
  isOpen,
  steps,
  theme,
  
}: BreathingInfoPanelProps) {

  const session = useTranslations("session.steps.step1")

  return (
    <div
      className={`
    w-full max-w-140 mx-auto mt-4
    overflow-hidden
    transition-[max-height,opacity] duration-700 ease-in-out
    ${isOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"}
  `}
    >

      <div className="flex flex-col gap-8">
        {steps.map((step, index) => (
          <div key={index} className="w-full flex flex-col gap-2.5">
            <div className="w-full flex gap-2">
              {step.icons.map((iconName, index) => (
                <div
                  key={index}
                  className=
                  {`flex items-center justify-center w-9 aspect-square ${theme.iconColor}
                   rounded-lg`}
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

            <div className="w-full flex flex-col gap-8">
              {step.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-text">
                  {session(paragraph)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}