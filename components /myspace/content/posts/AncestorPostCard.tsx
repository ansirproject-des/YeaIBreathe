"use client"

import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { DbComment, formatTimeAgo } from "@/lib/types";
import { PostContent } from "./PostContent";
import { useState } from "react";
import { ProfileAvatar } from "../../credits/ProfileAvatar";
import { ChevronDown, Plus } from "lucide-react";
import { IconButton } from "@/components /ui/IconButton";
import { BookmarkProvider } from "./PostBookmarkProvider";

type AncestorPostCardProps = {
  ancestor: DbComment,
  postId: string,
}

export function AncestorPostCard({ ancestor, postId }: AncestorPostCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeAgo = formatTimeAgo(ancestor.createdAt);
  return (
    <>
      
      {isOpen ? (
        <SurfaceCard
          className="border border-divider-surface p-2"
          defaultBg={false}
          defaultPadding={false}
        >
          <BookmarkProvider
          initialBookmarked={ancestor.isBookmarked}
          initialBookmarks={ancestor.bookmarksCount}
          >
          <PostContent
            postId={postId}
            commentId={ancestor.id}
            username={ancestor.user.username}
            displayName={ancestor.user.displayName}
            avatar={ancestor.user.avatar ?? undefined}
            content={ancestor.content ?? undefined}
            createdAt={ancestor.createdAt}
            attachments={ancestor.attachments}
            isBookmarked={ancestor.isBookmarked}
            isFollowing={ancestor.isFollowing}
            bookmarksCount={ancestor.bookmarksCount}
            variant="comment"
            isAuthor={ancestor.isAuthor}
            authorType={ancestor.authorType}
            likesCount={ancestor.likesCount}
            commentsCount={ancestor.repliesCount}
            isLiked={ancestor.isLiked}
            isOwner={ancestor.isOwner}
          />
          </BookmarkProvider>
        </SurfaceCard>
      ):
      (
        <SurfaceCard
        className="border border-divider-surface p-2"
        defaultBg={false}
        defaultPadding={false}
      >
        <div className="flex gap-2.5">
          <div className="relative h-9 w-9 shrink-0">
            <ProfileAvatar
              displayName={ancestor.user.displayName}
              avatar={ancestor.user.avatar ?? undefined}
              className="h-9 w-9"
              authorType={ancestor.authorType}
            />

            {ancestor.authorType === "public" && !ancestor.isOwner && (
              <div className="absolute -bottom-px -right-0.5">
                <div className="flex items-center justify-center rounded-full w-5.5 h-5.5 bg-primary border-2 border-surface">
                  <Plus className="w-4 h-4 text-text-inverse" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-between items-start">
            <div>
              <div className="flex gap-1 items-center">
                <p className="font-bold">
                  {ancestor.authorType === "public"
                    ? ancestor.user.displayName
                    : "Anonymous"}
                </p>

                <p className="text-text-absent">
                  @
                  {ancestor.authorType === "public"
                    ? ancestor.user.username
                    : "anonymous"}
                </p>
              </div>

              <p className="text-sm text-text-absent">
                {timeAgo}
              </p>
            </div>

            <IconButton
              variant="textMuted"
              onClick={() => setIsOpen(true)}
            >
              <ChevronDown className="size-5" />
            </IconButton>

          </div>
        </div>
      </SurfaceCard>
      )
      }

    </>
  )
}