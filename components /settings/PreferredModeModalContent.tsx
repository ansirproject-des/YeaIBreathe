import { useTranslations } from "next-intl";
import { MessageWrapper } from "../ui/MessageWrapper";

type PreferredModeModalContentProps = {
  close: () => void,
}

export function PreferredModeModalContent({close}: PreferredModeModalContentProps) {
  const mySpace = useTranslations("mySpace.menu.settings.preferences.mode")

  const disabled = true;
  return (
<>
          <div className="w-full mb-6">
            <h3 className="text-xl text-text font-bold">{mySpace("modalTitle")}</h3>
          </div>

          <div className="w-full flex flex-col gap-6">

            <MessageWrapper
            message={mySpace("helper")}
            >
            <div className="w-full flex gap-2 bg-surface p-4 rounded-[14px]">

              <button
                type="button"
                onClick={close}
                className="group w-full cursor-pointer"
              >
                <div className="w-full flex gap-1 h-30 border border-app-bg rounded-xl p-1 group-hover:opacity-80">
                  <div className="w-full h-full bg-app-bg rounded-lg transition-opacity group-hover:opacity-80" />

                  <div className="w-full h-full flex flex-col gap-1">
                    <div className="w-full h-full bg-app-bg rounded-lg transition-opacity group-hover:opacity-80" />

                    <div className="w-full h-full flex gap-1">
                      <div className="w-full h-full bg-app-bg rounded-lg transition-opacity group-hover:opacity-80" />
                      <div className="w-full h-full bg-app-bg rounded-lg transition-opacity group-hover:opacity-80" />
                    </div>
                  </div>
                </div>
              </button>



            <button
                type="button"
                onClick={close}
                disabled={disabled}
                className="group w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className={`w-full flex gap-1 h-30 border border-primary rounded-xl p-1 ${disabled 
                  ? ""
                  : "group-hover:opacity-95"
                   }`}>
                  <div className="w-full h-full bg-primary rounded-lg transition-opacity" />

                  <div className="w-full h-full flex flex-col gap-1">
                    <div className="w-full h-full bg-primary rounded-lg transition-opacity" />

                    <div className="w-full h-full flex gap-1">
                      <div className="w-full h-full bg-primary rounded-lg transition-opacity" />
                      <div className="w-full h-full bg-primary rounded-lg transition-opacity" />
                    </div>
                  </div>
                </div>
              </button>


            </div>
            </MessageWrapper>

          </div>
        </>
  )
}