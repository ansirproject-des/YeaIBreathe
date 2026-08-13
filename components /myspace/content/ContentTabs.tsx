"use client"

import { Tab } from "@/components /ui/Tab";
import { PostCard, PostCardUser } from "./posts/PostCard";
import { useState } from "react";
import { AboutCard } from "./about/AboutCard";
import { SavedCard } from "./saves/SavedCard";
import { useTranslations } from "next-intl";

type ContentFilter = "posts" | "saved" | "about";

type ContentTabsProps = {
  user: PostCardUser;
  isOwner: boolean,
  isFollowing: boolean,
  isPublicProfile: boolean,
}

export function ContentTabs({ user, isFollowing, isOwner, isPublicProfile }: ContentTabsProps) {
  const [content, setContent] = useState<ContentFilter>("posts");
  const mySpace = useTranslations("mySpace");

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex border-b-[1.5px] px-2 border-divider-surface">
        <Tab
          variant="underline"
          active={content === "posts"}
          onClick={() => setContent("posts")}
        >
          {mySpace("tabs.posts")}
        </Tab>

        {isOwner && (
          <Tab
            variant="underline"
            active={content === "saved"}
            onClick={() => setContent("saved")}
          >
            {mySpace("tabs.saved")}
          </Tab>
        )}

        <Tab
          variant="underline"
          active={content === "about"}
          onClick={() => setContent("about")}
        >
          {mySpace("tabs.about")}
        </Tab>
      </div>

      {content === "posts"
        ? (
          <PostCard user={user} isFollowing={isFollowing} isOwner={isOwner} isPublicProfile={isPublicProfile} />
        )
        : content === "saved"
          ? <SavedCard />
          : (<AboutCard user={user} isOwner={isOwner} />)
      }
    </div>
  )
}