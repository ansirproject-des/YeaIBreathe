"use client";

import { Tab } from "@/components /ui/Tab";
import { useTranslations } from "next-intl";

export type CheckInValue = "better" | "same" | "tense";

const tabs = [
  { value: "better", labelKey: "moodResult.better" },
  { value: "same", labelKey: "moodResult.same" },
  { value: "tense", labelKey: "moodResult.tense" },
] as const;

type CheckInTabsProps = {
  selected: CheckInValue | null;
  onSelect: (value: CheckInValue) => void;
  error?: string;
};

export function CheckInTabs({
  selected,
  onSelect,
  error,
}: CheckInTabsProps) {
  const session = useTranslations("session.steps.step2")
  const indicatorColor = "bg-danger";
  return (
    <div className="w-full">
      <div className="w-full flex gap-2.5">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            variant="pill"
            active={selected === tab.value}
            onClick={() => onSelect(tab.value)}
          >
            {session(tab.labelKey)}
          </Tab>
        ))}
      </div>

      {error && (
  <div className="mt-2 flex items-center gap-2 px-2 text-sm text-danger">
    <div className="relative overflow-visible">
      <div
        className={`
          absolute
          left-0
          top-0
          size-2
          rounded-full
          animate-helper-pulse
          ${indicatorColor}
        `}
      />

      <div
        className={`
          relative
          size-2
          rounded-full
          ${indicatorColor}
        `}
      />
    </div>

    <span
      key={error}
      className="animate-helper-fade"
    >
      {error}
    </span>
  </div>
)}
    </div>
  );
}