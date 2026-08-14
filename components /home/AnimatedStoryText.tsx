"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export function AnimatedStoryText() {
  const hero = useTranslations("hero");

  const lines = useMemo(
    () => Array.from({ length: 9 }, (_, index) =>
      hero(`story.lines.${index}`)
    ),
    [hero]
  );

  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [finishedLines, setFinishedLines] = useState<string[]>([]);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    let index = 0;
    const text = lines[currentLine];

    const typing = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(typing);

        setTimeout(() => {
          setFinishedLines((prev) => [...prev, text]);
          setDisplayedText("");
          setCurrentLine((prev) => prev + 1);
        }, 450);
      }
    }, 32);

    return () => clearInterval(typing);
  }, [currentLine, lines]);

  const getClassName = (index: number) => {
    if (index === 0) {
      return "mb-4 font-handwritten text-[22px] font-bold text-text [-webkit-text-stroke:0.2px_var(--color-text)]";
    }

    if (index === 5) {
      return "text-[15px] leading-8 font-semibold text-text";
    }

    if (index === 8) {
      return "mt-4 font-handwritten text-[14px] font-bold text-text";
    }

    if (index === 6) {
      return "text-sm leading-7 font-medium text-[#6B695F]";
    }

    return "text-sm leading-7 font-medium text-[#6B695F]";
  };

  return (
    <div className="flex w-full flex-col space-y-1 text-left">
      {finishedLines.map((line, index) => (
        <p key={index} className={getClassName(index)}>
          {line}
        </p>
      ))}

      {currentLine < lines.length && (
        <p className={getClassName(currentLine)}>
          {displayedText}
          <span className="ml-0.5 animate-caret text-text">|</span>
        </p>
      )}
    </div>
  );
}