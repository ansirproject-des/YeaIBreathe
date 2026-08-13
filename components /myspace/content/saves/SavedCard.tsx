"use client"

import { getSavedItems } from "@/lib/api/post"
import { PostContent } from "../posts/PostContent"
import { useQuery } from "@tanstack/react-query";
import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { FeedReplyInput } from "../posts/FeedReplyInput";
import { useState } from "react";
import { PostActions } from "../posts/PostActions";
import { BookmarkProvider } from "../posts/PostBookmarkProvider";


export function SavedCard() {
  const { data: savedItems = [] } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: getSavedItems,
  });

  const [openedItemId, setOpenedItemId] = useState<string | null>(null);

  return (
    <>
      <SurfaceCard>
        {savedItems.map((item, index) => {
          if (item.type === "post") {
            const post = item.data;

            return (
              <div
                key={index}
                className="w-full flex flex-col gap-2">
                <div
                  className={`w-full pb-4 ${index !== savedItems.length - 1
                    ? "border-b border-divider-surface"
                    : ""
                    }`}
                >
                  <BookmarkProvider
                    initialBookmarked={post.isBookmarked}
                    initialBookmarks={post.bookmarksCount}
                  >
                    <PostContent
                      postId={post.id}
                      username={post.user.username}
                      displayName={post.user.displayName}
                      avatar={post.user.avatar ?? undefined}
                      title={post.title}
                      content={post.content ?? ""}
                      createdAt={post.createdAt}
                      postType={post.type}
                      duration={post.duration}
                      category={post.category}
                      authorType={post.authorType}
                      attachments={post.attachments ?? undefined}
                      variant="feed"
                      isAuthor={true}
                      likesCount={post.likesCount}
                      commentsCount={post.commentsCount}
                      bookmarksCount={post.bookmarksCount}
                      isLiked={post.isLiked}
                      isFollowing={post.isFollowing}
                      isBookmarked={post.isBookmarked}
                      onCommentClick={() =>
                        setOpenedItemId(current =>
                          current === post.id ? null : post.id
                        )
                      }
                      isOwner={post.isOwner}
                      actions={
                        <PostActions
                          postId={post.id}
                          isOwner={post.isOwner}
                          id={post.id}
                          entity="post"
                        />
                      }
                    />

                  </BookmarkProvider>
                </div>
                {openedItemId === post.id && (
                  <FeedReplyInput postId={post.id} parentId={null} onClose={() => setOpenedItemId(null)} />
                )}
              </div>
            );
          }

          if (item.type === "comment") {
            const comment = item.data;

            return (
              <div
                key={index}
                className="w-full flex flex-col gap-2">
                <div
                  className={`w-full pb-4 ${index !== savedItems.length - 1
                    ? "border-b border-divider-surface"
                    : ""
                    }`}
                >
                  <BookmarkProvider
                    initialBookmarked={comment.isBookmarked}
                    initialBookmarks={comment.bookmarksCount}
                  >
                    <PostContent
                      key={comment.id}
                      postId={comment.postId}
                      commentId={comment.id}
                      username={comment.user.username}
                      displayName={comment.user.displayName}
                      avatar={comment.user.avatar ?? undefined}
                      content={comment.content ?? ""}
                      createdAt={comment.createdAt}
                      authorType={comment.authorType}
                      attachments={comment.attachments ?? undefined}
                      isDeleted={comment.isDeleted}
                      variant="comment"
                      likesCount={comment.likesCount}
                      commentsCount={comment.repliesCount}
                      bookmarksCount={comment.bookmarksCount}
                      isLiked={comment.isLiked}
                      isAuthor={comment.isAuthor}
                      isFollowing={comment.isFollowing}
                      isBookmarked={comment.isBookmarked}
                      onCommentClick={() =>
                        setOpenedItemId(current =>
                          current === comment.id ? null : comment.id
                        )
                      }
                      isOwner={comment.isOwner}
                      actions={
                        <PostActions
                          postId={comment.postId}
                          isOwner={comment.isOwner}
                          id={comment.id}
                          entity="comment"
                        />
                      }
                    />
                  </BookmarkProvider>
                </div>
                {openedItemId === comment.id && (
                  <FeedReplyInput postId={comment.postId} parentId={comment.id} onClose={() => setOpenedItemId(null)} />
                )}
              </div>

            )
          }

          return null;
        })}
      </SurfaceCard>
    </>
  )
}