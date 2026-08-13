import { motion } from "motion/react";
import { IntroCard } from "../assets/IntroCard";
import Feet from "@/public/images/feet.png"
import Drop from "@/public/images/drop.png"
import Ba from "@/public/images/ba.png"


export function IntroSlide() {
  return (
    <div className="w-full flex flex-col gap-4 mt-4 items-center">
      <div className="relative w-full h-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">

  {/* Left */}
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

  {/* Middle */}
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

  {/* Right */}
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
          <p className="w-full text-center text-2xl font-bold">Welcome to YeaIBreathe</p>
          <div className="w-full flex flex-col">
            <p className="w-full text-center text-text-descr">
              We spend thousands of hours learning how to work.
            </p>
            <p className="w-full text-center text-text-descr">
              Almost none learning <span className="text-text font-bold">how to rest.</span>
            </p>
          </div>

        </div>
        <p className="w-full text-center text-text-descr">Starting from this screen let&apos;s learn how to slow down.</p>
      </div>

    </div>
  )
}