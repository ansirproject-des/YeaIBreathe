"use client";

import { calculateReadingTime } from "@/lib/post/readingTime";
import { Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";

type TagVariant = "reflection" | "practice" | "tip" | "file";

const tagVariants: Record<TagVariant, string> = {
  reflection: "bg-reflection-muted text-reflection",
  practice: "bg-practice-muted text-practice",
  tip: "bg-tip-muted text-tip",
  file: "bg-surface-gray text-text",
};

type PostTagsProps = {
  variant: TagVariant,
  category?: string,
  duration?: number,
  fileCount?: number,
  postContent?: string,
};

export function PostTags({
  variant,
  category,
  postContent,
  duration,
  fileCount,
}: PostTagsProps) {
  const categoryKey = category?.toLowerCase();

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${minutes}${mySpace("posts.postCard.tags.min")}`;
    }

    if (remainingMinutes === 0) {
      return `${hours}${mySpace("posts.postCard.tags.h")}`;
    }

    return `${hours}${mySpace("posts.postCard.tags.h")} ${remainingMinutes}${mySpace("posts.postCard.tags.m")}`;
  }
  const mySpace = useTranslations("mySpace");
  let content: React.ReactNode;

  switch (variant) {
    case "tip": {
      const readingTime = calculateReadingTime(postContent ?? "");

      content = `${mySpace("posts.postCard.tags.tip")} • ${category
          ? mySpace(`posts.create.category.${categoryKey}`)
          : ""
        } • ${readingTime} ${mySpace("posts.postCard.tags.timeRead")}`;

      break;
    }

    case "practice":
      content = `${mySpace("posts.postCard.tags.practice")} • ${formatDuration(duration ?? 10)}`;
      break;

    case "reflection":
      content = mySpace("posts.postCard.tags.reflection");
      break;

    case "file":
      content = (
        <>
          <Paperclip className="w-3.5 h-3.5" />
          {fileCount}
        </>
      );
      break;
  }

  return (
    <div
      className={`
        ${tagVariants[variant]}
        w-fit
        rounded
        px-2
        py-0
        mt-2
        text-sm
        font-medium
        flex items-center gap-1
      `}
    >
      {content}
    </div>
  );
}