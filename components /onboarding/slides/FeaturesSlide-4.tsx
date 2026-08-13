import { motion } from "motion/react";
import { AnimatedCheckBox } from "../assets/AnimatedCheckbox";


export function FeaturesSlide() {
  return (
    <div className="w-full flex flex-col gap-6 mt-4 px-2 items-center">
      <p className="w-full text-2xl font-bold">
        Here&apos;s what you&apos;ll find
      </p>

      <div className="w-full flex flex-col">
        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
              Breathe with guidance.
            </p>
            <p className="text-text-muted text-sm">Calm your nervous system.</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.2} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
              Reflect through journaling.
            </p>
            <p className="text-text-muted text-sm">Understand yourself over time.</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.4} />

          <div className="flex flex-col gap-0.5">
            <p className="flex-1">
              Collect what helps you personally.
            </p>
            <p className="text-text-muted text-sm">Build your own Calm Toolkit.</p>
          </div>
        </div>

        <div className="flex w-full gap-4 py-2.5 items-start">
          <AnimatedCheckBox delay={0.6} />

          <p className="flex-1">
            Share what helps you.
            Discover what helps others while staying private, anonymous, or public.
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

          className="flex py-3 text-xs text-text-descr px-4 mt-6 bg-app-gray border border-app-gray-hover rounded-xl">
          *Privacy comes first. Share only what feels right. Everything else stays yours until you decide otherwise.</motion.div>
      </div>
    </div>


  );
}