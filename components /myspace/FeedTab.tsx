"use client"

import { getFeed } from "@/lib/api/feed"
import { useQuery } from "@tanstack/react-query"
import { PostContent } from "./content/posts/PostContent"
import { SurfaceCard } from "../ui/SurfaceCard"
import { PostsState } from "./content/posts/EmptyPosts"
import { BookmarkProvider } from "./content/posts/PostBookmarkProvider"
import { useState } from "react"
import { FeedReplyInput } from "./content/posts/FeedReplyInput"
import { PostActions } from "./content/posts/PostActions"
import { useTranslations } from "next-intl"

export function FeedTab() {
  const [openedPostId, setOpenedPostId] = useState<string | null>(null);

  const mySpace = useTranslations("mySpace");
   const common = useTranslations("common");

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: getFeed,
  })

  if (isLoading) {
    return (
      <PostsState
        titleKey={common("loading.posts.title")}
        messageKey={common("loading.posts.message")}
      />
    );
  }

  if (error) {
    return (
      <PostsState
        titleKey={common("loading.posts.errorTitle")}
        messageKey={common("loading.posts.errorMessage")}
      />
    );
  }


  return (
    <div className="w-full px-0">
      <div
        className="w-full max-w-170 mx-auto flex flex-col mt-1 mb-8 sm:mt-8 gap-8"
      >
        <SurfaceCard>
          <div className="w-full flex flex-col my-2">

            <div className="w-full flex flex-col gap-5">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="w-full flex flex-col">
                  <div
                    className={`w-full pb-4 ${index !== posts.length - 1
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
                        userId={post.user.id}
                        username={post.user.username}
                        displayName={post.user.displayName}
                        avatar={post.user.avatar ?? ""}
                        title={post.title}
                        content={post.content ?? ""}
                        postType={post.type}
                        duration={post.duration}
                        category={post.category}
                        authorType={post.authorType}
                        attachments={post.attachments}
                        isOwner={post.isOwner}
                        variant="feed"
                        likesCount={post.likesCount}
                        isAuthor={true}
                        commentsCount={post.commentsCount}
                        bookmarksCount={post.bookmarksCount}
                        isBookmarked={post.isBookmarked}
                        isLiked={post.isLiked}
                        createdAt={post.createdAt}
                        isFollowing={post.isFollowing}
                        onCommentClick={() =>
                          setOpenedPostId(current =>
                            current === post.id ? null : post.id
                          )
                        }
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

                  {post.visibility === "followers_only" && (
                    <div className="text-sm text-text-muted bg-surface-midgray py-1 px-4 mb-2">{mySpace("posts.postCard.followers_only")}</div>
                  )}

                  {openedPostId === post.id && (
                    <FeedReplyInput postId={post.id} onClose={() => setOpenedPostId(null)} parentId={null} />
                  )}
                </div>
              ))}

            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  )
}