"use client"

import { DbComment } from "@/lib/types"
import { PostContent } from "./PostContent"
import { useComments } from "./CommentsProvider";
import { RepliesList } from "./RepliesList";
import { PostActions } from "./PostActions";
import { BookmarkProvider } from "./PostBookmarkProvider";
import { useTranslations } from "next-intl";

type CommentsListProps = {
  comments: DbComment[],
  postId: string,
}

export function CommentsList({ comments, postId, }: CommentsListProps) {
  const { setReplyTarget } = useComments();
  const mySpace = useTranslations("mySpace");


  return (
    <>
      <div className="w-full flex flex-col gap-6">

        <p className="font-bold pb-2 border-b border-divider-surface">{mySpace("posts.postCard.replies.label")}</p>

        <div className="w-full flex flex-col gap-5">

          {comments.map((comment, index) => (
            <div
              key={index}
              className="flex flex-col gap-2">
              <div
                className={`w-full flex flex-col pb-4 ${index === comments.length - 1 ? "border-none" : "border-b border-divider-surface"}`}
              >
                <BookmarkProvider
                initialBookmarked={comment.isBookmarked}
                initialBookmarks={comment.bookmarksCount}
                >
                <PostContent
                  postId={postId}
                  commentId={comment.id}
                  username={comment.user.username}
                  displayName={comment.user.displayName}
                  avatar={comment.user.avatar ?? undefined}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  attachments={comment.attachments}
                  likesCount={comment.likesCount}
                  isLiked={comment.isLiked}
                  isBookmarked={comment.isBookmarked}
                  bookmarksCount={comment.bookmarksCount}
                  isDeleted={comment.isDeleted}
                  isFollowing={comment.isFollowing}
                  isAuthor={comment.isAuthor}
                  variant="comment"
                  authorType={comment.authorType}
                  commentsCount={comment.repliesCount}
                  isOwner={comment.isOwner}
                  onCommentClick={() =>
                    setReplyTarget({
                      id: comment.id,
                      username: comment.user.username,
                      authorType: comment.authorType,
                    })
                  }
                  actions={
                    <PostActions
                      postId={postId}
                      isOwner={comment.isOwner}
                      id={comment.id}
                      entity="comment"
                    />
                  }
                />
                </BookmarkProvider>

                <RepliesList
                  postId={postId}
                  commentId={comment.id}
                  onCommentClick={(reply) =>
                    setReplyTarget({
                      id: reply.id,
                      username: reply.user.username,
                      authorType: reply.authorType,
                    })
                  }
                />
              </div>

            </div>
          ))}



        </div>
      </div>
    </>
  )
}