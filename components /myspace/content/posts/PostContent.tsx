"use client";

import { Plus } from "lucide-react";
import { ProfileAvatar } from "../../credits/ProfileAvatar";
import { PostBody } from "./PostBody";
import { PostFooter } from "./PostFooter";
import {
  DbAttachment,
  DbPost,
  formatTimeAgo,
  PostSettings,
} from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components /ui/Button";
import { toggleFollow } from "@/app/actions/follow";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";

export type PostContentProps = {
  postId: string;
  userId?: string,
  commentId?: string,
  username: string;
  displayName: string;
  avatar?: string;
  title?: string;
  content?: string;
  postType?: DbPost["type"];
  duration?: number;
  category?: string;
  createdAt: Date | string;
  authorType: PostSettings["authorType"];
  isOwner: boolean;
  attachments?: DbAttachment[];
  actions?: React.ReactNode;
  variant?: "feed" | "page" | "comment";
  likesCount: number,
  commentsCount: number,
  bookmarksCount: number,
  isLiked: boolean,
  isAuthor: boolean,
  isDeleted?: boolean,
  isFollowing: boolean,
  isBookmarked: boolean,
  onCommentClick?: () => void,
};

export function PostContent({
  postId,
  userId,
  commentId,
  username,
  displayName,
  avatar,
  title,
  content,
  createdAt,
  duration,
  category,
  postType,
  authorType,
  isOwner,
  attachments,
  actions,
  variant = "feed",
  likesCount,
  commentsCount,
  isLiked,
  isDeleted,
  isAuthor,
  isFollowing,
  onCommentClick,
}: PostContentProps) {
  const router = useRouter();
  const timeAgo = formatTimeAgo(createdAt);
  const isFeed = variant === "feed";
  const isPage = variant === "page";
  const isComment = variant === "comment";

  const mySpace = useTranslations("mySpace");

  const navigateTo =
    isFeed
      ? `/my-space/post/${postId}`
      : (isComment) && commentId
        ? `/my-space/post/${postId}/comment/${commentId}`
        : null;

  const postBody = (
    <div
      className={navigateTo ? "cursor-pointer" : undefined}
      onClick={
        navigateTo
          ? (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;

            if (
              target.closest("a") ||
              target.closest("button") ||
              target.closest("video") ||
              target.closest("audio")
            ) {
              return;
            }

            router.push(navigateTo);
          }
          : undefined
      }
    >
      {isDeleted ? (
        <p className="italic text-text-absent">
          Deleted comment ({commentsCount})
        </p>

      ) : (
        <PostBody
          title={title}
          content={content}
          attachments={attachments}
          expanded={!isFeed}
        />
      )}
    </div>
  );

  const queryClient = useQueryClient();

  const handleFollow = async () => {
    if (!userId) return;

    const result = await toggleFollow(userId);

    if (!result.success) return;

    queryClient.setQueryData<DbPost[]>(["feed"], (posts) => {
      if (!posts) return posts;

      return posts.map((post) =>
        post.user.id === userId
          ? {
            ...post,
            isFollowing: result.following,
          }
          : post
      );
    });

    router.refresh();
  };


  return (
    <div className="w-full flex flex-col gap-4">

      {!isDeleted && (
        <div className="flex gap-2.5">
          <div className={`relative ${isComment ? "h-9 w-9" : "h-11 w-11"} shrink-0`}>

            {authorType === "public" ? (
              <Link
                href={`/u/${username}`}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0"
              >
                <ProfileAvatar
                  displayName={displayName}
                  avatar={avatar}
                  className={`${isComment ? "h-9 w-9" : "h-11 w-11"}`}
                  authorType={authorType}
                />
              </Link>
            ) : (
              <ProfileAvatar
                displayName={displayName}
                avatar={avatar}
                className={`${isComment ? "h-9 w-9" : "h-11 w-11"}`}
                authorType={authorType}
              />
            )}

            {authorType === "public" &&
              !isOwner &&
              !isFollowing &&
              !isPage && (
                <button
                  className="absolute -bottom-px -right-0.5"
                  onClick={handleFollow}
                >
                  <div className="flex items-center justify-center rounded-full w-5.5 h-5.5 bg-primary hover:bg-primary/80 cursor-pointer border-2 border-surface">
                    <Plus className="w-4 h-4 text-text-inverse" />
                  </div>
                </button>
              )}
          </div>

          <div className="flex-1 min-w-0 flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1">
                {authorType === "public" ? (
                  <Link
                    href={`/u/${username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold min-w-0 truncate hover:text-text/80 cursor-pointer"
                  >
                    {displayName}
                  </Link>
                ) : (
                  <p className="font-bold min-w-0 truncate">
                    Anonymous
                  </p>
                )}


                <p className="text-text-absent min-w-0 truncate">
                  @
                  {authorType === "public"
                    ? username
                    : "anonymous"}
                </p>

                {(isPage || isComment) && isAuthor && (
                  <div className="text-text-absent whitespace-nowrap shrink-0">
                    • {mySpace("posts.postCard.author")}
                  </div>
                )}
              </div>

              <p className="text-sm text-text-absent">
                {timeAgo}
              </p>
            </div>

            {!isDeleted && (isFeed || isComment)
              ? actions
              : isPage && !isOwner
                ? (
                  <Button
                    variant={isFollowing ? "secondaryGray" : "primary"}
                    onClick={handleFollow}
                    size="sm"
                    className="shrink-0"
                  >
                    {isFollowing ? mySpace("posts.postCard.follow.following") : mySpace("posts.postCard.follow.follow")}
                  </Button>
                )
                : null
            }

          </div>
        </div>
      )}


      {isPage && (
        <>
          {postBody}

          <PostFooter
            id={postId}
            entity="post"
            postType={postType}
            content={content}
            category={category}
            duration={duration}
            attachments={attachments}
            likesCount={likesCount}
            commentsCount={commentsCount}
            isLiked={isLiked}
          />
        </>
      )}


      {isFeed && (
        <>
          <div className="pl-13">
            {postBody}
          </div>

          <div className="pl-13">
            <PostFooter
              id={postId}
              entity="post"
              postType={postType}
              category={category}
              content={content}
              duration={duration}
              attachments={attachments}
              likesCount={likesCount}
              commentsCount={commentsCount}
              isLiked={isLiked}
              onCommentClick={onCommentClick}
            />
          </div>
        </>
      )}

      {isComment && (
        <>
          <div className="pl-11.5">
            {postBody}
          </div>

          {!isDeleted && (
            <div className="pl-11.5">
              <PostFooter
                id={commentId!}
                postId={postId}
                content={content}
                entity="comment"
                onCommentClick={onCommentClick}
                likesCount={likesCount}
                commentsCount={commentsCount}
                isLiked={isLiked}
              />
            </div>
          )}
        </>
      )}


    </div>
  );
}