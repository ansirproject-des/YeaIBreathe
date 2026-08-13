"use client"

import { DbPost } from "@/lib/types";
import { Button } from "../ui/Button";
import { PostCardUser } from "./content/posts/PostCard";
import { useState } from "react";
import { FeedTab } from "./FeedTab";
import { ProfileTab } from "./ProfileTab";
import { useTranslations } from "next-intl";

type TabTypes = "feed" | "profile";

type MySpaceTabsProps = {
  user: PostCardUser;
  posts: DbPost[];
  followersCount: number;
};

export function MySpaceTabs({user, posts, followersCount,}: MySpaceTabsProps) {
   const [tab, setTab] = useState<TabTypes>("feed")
   const mySpace = useTranslations("mySpace");

  return (
    <>

    {tab === "feed" && (
      <FeedTab/>
    )}

    {tab === "profile" && (
      <ProfileTab user={user} posts={posts} followersCount={followersCount} isFollowing={false} isOwner={true}/>
    )}


    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
  <div className="relative flex items-center rounded-xl bg-app-bg/72 backdrop-blur-xs shadow-sm border border-surface p-1">
    
    <div
      className={`
        absolute top-1 bottom-1 w-[calc(50%-4px)]
        rounded-lg bg-primary
        transition-transform duration-200 ease-in-out
        ${tab === "profile" ? "translate-x-full" : "translate-x-0"}
      `}
    />

    <Button
      variant="custom"
      size="sm"
      onClick={() => setTab("feed")}
      className={`relative z-10 w-24 ${
        tab === "feed" ? "text-text-inverse" : "hover:text-text/80"
      }`}
    >
     {mySpace("tabs.feed")}
    </Button>

    <Button
      variant="custom"
      size="sm"
      onClick={() => setTab("profile")}
      className={`relative z-10 w-24 ${
        tab === "profile" ? "text-text-inverse" : "hover:text-text/80"
      }`}
    >
      {mySpace("tabs.profile")}
    </Button>

  </div>
</nav>

    </>
  );
}