"use client";

import { useEffect, useState } from "react";

const lines = [
  "Dear friend,",
  "You might be functioning just fine on the outside.",
  "Getting things done. Answering messages. Moving through the day.",
  "And still feel overwhelmed, tense, or suddenly anxious inside.",
  "This isn't another app asking you to do more.",
  "It's about pausing — long enough for your body to remember it's safe.",
  "I made this space for those moments.",
  "To pause. To breathe. To feel a little more steady again.",
  "You are safe here",
];

export function AnimatedStoryText() {
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
  }, [currentLine]);

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