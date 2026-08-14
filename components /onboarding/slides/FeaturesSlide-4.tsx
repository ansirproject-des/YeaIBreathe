import { motion } from "motion/react";
import { AnimatedCheckBox } from "../assets/AnimatedCheckbox";
import { useTranslations } from "next-intl";


export function FeaturesSlide() {

    const onboarding = useTranslations("onboarding");
  
  return (
    <div className="w-full flex flex-col gap-6 mt-4 px-2 items-center">
      <p className="w-full text-2xl font-bold">
        {onboarding("features.title")}
      </p>

      <div className="w-full flex flex-col">
        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
              {onboarding("features.checkbox1.title")}
            </p>
            <p className="text-text-muted text-sm">{onboarding("features.checkbox1.subtitle")}</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.2} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
              {onboarding("features.checkbox2.title")}
            </p>
            <p className="text-text-muted text-sm">{onboarding("features.checkbox2.subtitle")}</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.4} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
             {onboarding("features.checkbox3.title")}
            </p>
            <p className="text-text-muted text-sm">{onboarding("features.checkbox3.subtitle")}</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.6} />

          <p className="flex-1">
            {onboarding("features.checkbox4.subtitle")}
          </p>
        </div>

        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="flex py-3 text-sm text-text-descr px-4 mt-6 bg-app-gray border border-app-gray-hover rounded-xl">
          {onboarding("features.privacy")}</motion.div>
      </div>
    </div>


  );
}