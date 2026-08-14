import { motion } from "motion/react";
import { IntroCard } from "../assets/IntroCard";
import Feet from "@/public/images/feet.png"
import Drop from "@/public/images/drop.png"
import Ba from "@/public/images/ba.png"
import { useTranslations } from "next-intl";


export function IntroSlide() {

  const onboarding = useTranslations("onboarding");

  return (
    <div className="w-full flex flex-col gap-4 mt-4 items-center">
      <div className="relative w-full h-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">

  <motion.div
    initial={{
      opacity: 0,
      rotate: -18,
      x: -80,
      scale: 0.8,
    }}
    animate={{
      opacity: 1,
      y: [0, -8, 0],
    }}
    transition={{
      opacity: { duration: .5 },
      rotate: { duration: .6 },
      x: { duration: .6 },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
   className="absolute -translate-x-6 translate-y-3 z-10"
  >
    <IntroCard src={Feet} />
  </motion.div>


  <motion.div
  animate={{
    opacity: 1,
    scale: 1,
    y: [0, -10, 0],
  }}
  transition={{
    duration: 0.6,
    y: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
  className="absolute z-20"
>
  <IntroCard src={Drop} />
</motion.div>


  <motion.div
    initial={{
      opacity: 0,
      rotate: 18,
      x: 80,
      scale: 0.8,
    }}
    animate={{
      opacity: 1,
      y: [0, -10, 0],
    }}
    transition={{
      delay: .3,
      opacity: { duration: .5 },
      rotate: { duration: .6 },
      x: { duration: .6 },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
className="absolute translate-x-6 translate-y-3 z-30"
  >
    <IntroCard src={Ba} />
  </motion.div>

</div>
      </div>


      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex flex-col gap-2">
          <p className="w-full text-center text-2xl font-bold">{onboarding("intro.welcome")}</p>
          <div className="w-full flex flex-col">
            <p className="w-full text-center text-text-descr">
              {onboarding("intro.message1")}
            </p>
            <p className="w-full text-center text-text-descr">
             {onboarding("intro.message2.1")} <span className="text-text font-bold">{onboarding("intro.message2.2")}</span>
            </p>
          </div>

        </div>
        <p className="w-full text-center text-text-descr">{onboarding("intro.message3")}</p>
      </div>

    </div>
  )
}