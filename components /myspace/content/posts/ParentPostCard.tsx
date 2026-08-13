"use client"

import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { DbPost, formatTimeAgo } from "@/lib/types";
import { PostContent } from "./PostContent";
import { useState } from "react";
import { ProfileAvatar } from "../../credits/ProfileAvatar";
import { ChevronDown, Plus } from "lucide-react";
import { IconButton } from "@/components /ui/IconButton";
import { BookmarkProvider } from "./PostBookmarkProvider";
import { useTranslations } from "next-intl";

type ParentPostCardProps = {
  post: DbPost,
}

export function ParentPostCard({ post }: ParentPostCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeAgo = formatTimeAgo(post.createdAt);
  const mySpace = useTranslations("mySpace");

  return (
    <>

      {isOpen ? (
        <SurfaceCard
          className="border border-divider-surface p-2"
          defaultBg={false}
          defaultPadding={false}
        >
          <BookmarkProvider
            initialBookmarked={post.isBookmarked}
            initialBookmarks={post.bookmarksCount}
          >
          <PostContent
            postId={post.id}
            username={post.user.username}
            displayName={post.user.displayName}
            postType={post.type}
            avatar={post.user.avatar ?? undefined}
            title={post.title ?? undefined}
            content={post.content ?? undefined}
            createdAt={post.createdAt}
            attachments={post.attachments}
            isBookmarked={post.isBookmarked}
            bookmarksCount={post.bookmarksCount}
            isFollowing={post.isFollowing}
            variant="comment"
            isAuthor={true}
            authorType={post.authorType}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            isLiked={post.isLiked}
            isOwner={post.isOwner}
          />
          </BookmarkProvider>
        </SurfaceCard>

      ) :

        <SurfaceCard
          className="border border-divider-surface p-2"
          defaultBg={false}
          defaultPadding={false}
        >
          <div className="flex gap-2.5">
            <div className="relative h-9 w-9 shrink-0">
              <ProfileAvatar
                displayName={post.user.displayName}
                avatar={post.user.avatar ?? undefined}
                className="h-9 w-9"
                authorType={post.authorType}
              />

              {post.authorType === "public" && !post.isOwner && (
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
                    {post.authorType === "public"
                      ? post.user.displayName
                      : "Anonymous"}
                  </p>

                  <p className="text-text-absent">
                    @
                    {post.authorType === "public"
                      ? post.user.username
                      : "anonymous"}
                  </p>

                  <div className="text-text-absent">
                    • {mySpace("posts.postCard.author")}
                  </div>
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
      }

    </>
  )
}