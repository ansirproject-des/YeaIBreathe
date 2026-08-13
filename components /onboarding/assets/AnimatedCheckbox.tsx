"use client";

import { motion } from "motion/react";

type AnimatedCheckBoxProps = {
  delay?: number;
};

export function AnimatedCheckBox({
  delay = 0,
}: AnimatedCheckBoxProps) {
  return (
    <div className="relative size-10 shrink-0">
      <div className="absolute inset-0 rounded-[10px] border border-app-gray-hover bg-app-gray/50" />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 44 44"
      >
        <defs>
          <linearGradient
            id="checkGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#000000" />
            <stop offset="35%" stopColor="#90C5FF" />
            <stop offset="60%" stopColor="#90C5FF" />
            <stop offset="90%" stopColor="#E39F72" />
          </linearGradient>
        </defs>
        <motion.rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="10"
          fill="none"
          strokeWidth="2"
          stroke="url(#checkGradient)"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            delay,
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </svg>

      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: [0, 1.15, 1],
          opacity: 1,
        }}
        transition={{
          delay: delay + 0.75,
          duration: 0.3,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 18 18"
        >
          <defs>
            <linearGradient
              id="checkGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF8A5B" />
              <stop offset="100%" stopColor="#F8D26A" />
            </linearGradient>
          </defs>

          <path
            d="M4 9L7.5 12.5L14 6"
            fill="none"
            stroke="url(#checkGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}