"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getReplies } from "@/lib/api/post";
import { DbComment } from "@/lib/types";
import { PostContent } from "./PostContent";
import { BookmarkProvider } from "./PostBookmarkProvider";
import { PostActions } from "./PostActions";
import { useTranslations } from "next-intl";

type RepliesListProps = {
  postId: string;
  commentId: string;
  onCommentClick?: (reply: DbComment) => void;
};

export function RepliesList({
  postId,
  commentId,
  onCommentClick,
}: RepliesListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mySpace = useTranslations("mySpace");

  const {
    data: replies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getReplies(commentId),
  });

  const MAX_REPLIES = 4;

  const shouldShowReplies = replies.length === 1 || isOpen;

  const repliesToRender =
    replies.length === 1
      ? replies
      : replies.slice(0, MAX_REPLIES);

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    <>
      {shouldShowReplies && (
        <div className="w-full flex flex-col gap-4 pl-11.5 mt-8">
          {repliesToRender.map((reply) => (

            <BookmarkProvider
              key={reply.id}
              initialBookmarked={reply.isBookmarked}
              initialBookmarks={reply.bookmarksCount}
            >

              <PostContent
                key={reply.id}
                postId={postId}
                commentId={reply.id}
                username={reply.user.username}
                displayName={reply.user.displayName}
                avatar={reply.user.avatar ?? undefined}
                content={reply.content}
                createdAt={reply.createdAt}
                attachments={reply.attachments}
                likesCount={reply.likesCount}
                bookmarksCount={reply.bookmarksCount}
                isBookmarked={reply.isBookmarked}
                isLiked={reply.isLiked}
                isAuthor={reply.isAuthor}
                isFollowing={reply.isFollowing}
                variant="comment"
                authorType={reply.authorType}
                commentsCount={reply.repliesCount}
                isOwner={reply.isOwner}
                onCommentClick={() => onCommentClick?.(reply)}
                actions={
                                      <PostActions
                                        postId={postId}
                                        isOwner={reply.isOwner}
                                        id={reply.id}
                                        entity="comment"
                                      />
                                    }
              />
            </BookmarkProvider>
          ))}
        </div>
      )}

      {!shouldShowReplies && replies.length > 1 && (
        <button
          className="w-full flex pl-11.5 mt-4 text-text-muted cursor-pointer hover:text-text transition-all duration-200"
          onClick={() => setIsOpen(true)}
        >
          {mySpace("posts.postCard.replies.show")}
        </button>
      )}
    </>
  );
}