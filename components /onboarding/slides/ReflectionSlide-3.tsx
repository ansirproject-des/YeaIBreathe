"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const timeline = [
  {
    id: 1,
    progress: "22%",
    popoverBorder: "border border-app-gray",
    icon: "bg-primary h-4 w-4",
  },
  {
    id: 2,
    progress: "40%",
    popoverBorder: "border border-app-gray",
    icon: "bg-primary h-4 w-4",
  },
  {
    id: 3,
    progress: "52%",
    icon: "bg-[#90C5FF] w-11 h-11 blur-[4px] animate-hint-pulse",
    popoverBorder: "border border-app-gray",
    isCurrent: true,
  },
  {
    id: 4,
    progress: "86%",
    popoverBorder: "border border-app-gray",
    icon: "bg-primary h-4 w-4",
  },
];

export function ReflectionSlide() {
  const [popoverPositions, setPopoverPositions] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const [phase, setPhase] = useState(0);

  const onboarding = useTranslations("onboarding");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 2600),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleDrag = (
    id: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const current = popoverPositions[id] || { x: 0, y: 0 };

    const move = (event: PointerEvent) => {
      setPopoverPositions((prev) => ({
        ...prev,
        [id]: {
          x: current.x + event.clientX - startX,
          y: current.y + event.clientY - startY,
        },
      }));
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  return (
    <div className="w-full flex flex-col gap-8 mt-1 items-center">
      <div className="w-full flex flex-col gap-2">
        <p className="w-full text-2xl font-bold">{onboarding("reflection.title")}</p>
        <p className="text-text-descr">{onboarding("reflection.subtitle")}</p>
      </div>

      <div className="relative w-full">

        <div className="absolute inset-0 px-3 pt-6 flex flex-col gap-12">
          {timeline.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <p className="text-primary">
                {onboarding(`reflection.timeline.${item.id}.title`)}
              </p>

              <div className="relative">
                <motion.div
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: phase >= 1 ? 1 : 0,
                  }}
                  transition={{
                    delay: item.id * 0.22,
                    duration: 0.20,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    originX: 0,
                  }}
                  className="h-px w-full bg-primary/14"
                />

                <div
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: item.progress }}
                >
                  <div className="relative">

                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                      }}
                      animate={{
                        scale: phase >= 2 ? 1 : 0,
                        opacity: phase >= 2 ? 1 : 0,
                      }}
                      transition={{
                        delay: item.id * 0.22,
                        duration: 0.32,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    >
                      <div className={`rounded-full ${item.icon}`} />
                    </motion.div>

                    <motion.div
                      animate={
                        item.isCurrent
                          ? { y: [0, -12, 0] }
                          : { y: 0 }
                      }
                      transition={
                        item.isCurrent
                          ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                          : undefined
                      }
                      className="absolute bottom-full mb-3 left-1/2"
                    >
                      <div
                        onPointerDown={(e) => handleDrag(item.id, e)}
                        style={{
                          transform: `
                          translateX(calc(-40% - 20px))
                          translateY(${popoverPositions[item.id]?.y || 0}px)
                        `,
                        }}
                        className="
                          w-38
                          cursor-grab
                          active:cursor-grabbing
                          touch-none
                        "
                      >
                        <div className={`rounded-xl bg-surface/20 ${item.popoverBorder} px-3 py-2 backdrop-blur-sm`}>
                          <div className="text-[13px]">
                            {item.id === 4 ? (
                              <>
                                {onboarding("reflection.timeline.4.descr.1")}
                                <br />
                                {onboarding("reflection.timeline.4.descr.2")}
                                <br />
                                {onboarding("reflection.timeline.4.descr.3")}
                              </>
                            ) : (
                              onboarding(`reflection.timeline.${item.id}.desc`)
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {item.isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex h-7 w-7 items-center justify-center">

                        <div className="absolute inset-0 rounded-full bg-[#F0AC7E] blur-[3px]" />

                        <div className="relative h-3 w-3 rounded-full bg-primary" />

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>

    </div>
  );
}

