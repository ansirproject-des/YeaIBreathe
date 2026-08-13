import { Header } from "@/components /layout/Header";
import { AncestorPostCard } from "@/components /myspace/content/posts/AncestorPostCard";
import { BackButtonComment } from "@/components /myspace/content/posts/BackButtonComment";
import { CommentsList } from "@/components /myspace/content/posts/CommentsList";
import { CommentsProvider } from "@/components /myspace/content/posts/CommentsProvider";
import { ParentPostCard } from "@/components /myspace/content/posts/ParentPostCard";
import { BookmarkProvider } from "@/components /myspace/content/posts/PostBookmarkProvider";
import { PostContent } from "@/components /myspace/content/posts/PostContent";
import { ReplyInput } from "@/components /myspace/content/posts/ReplyInput";
import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { getCommentAncestors, getCommentById, getReplies } from "@/lib/post/comment";
import { getPostById } from "@/lib/post/post";
import { getCurrentDbUser } from "@/lib/user/user";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";


type CommentPageProps = {
  params: Promise<{
    commentId: string,
    postId: string,
  }>
}

export default async function CommentPage({ params }: CommentPageProps) {
  const { commentId, postId } = await params;
  const comment = await getCommentById(commentId);
  const replies = await getReplies(commentId);
  const post = await getPostById(postId);
  const user = await getCurrentDbUser();
  const ancestors = await getCommentAncestors(commentId);

  const mySpace = await getTranslations("mySpace");


  if (!comment) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const isOwner = post.user.id === user.id;

  const canComment =
    post.commentPermission === "anyone" ||
    post.isFollowing ||
    isOwner;

  return (
    <>
      <BookmarkProvider
        initialBookmarked={comment.isBookmarked}
        initialBookmarks={comment.bookmarksCount}
      >
        <div className="w-full shrink-0">
          <Header
            left={
              <BackButtonComment />
            }

            center={
              <div
                className="flex size-12 items-center justify-center font-medium text-lg">
                Reply</div>
            }

            right={
              <>

              </>
            }
            className="justify-center"
            innerClassName="w-full max-w-200"
          />
        </div>

        <CommentsProvider>
          <main className="w-full flex-1 overflow-y-auto px-0 hide-scrollbar">
            <div
              className="w-full max-w-170 mx-auto flex flex-col mt-1 mb-8 sm:mt-8"
            >

              <SurfaceCard>
                <div className="w-full flex flex-col mt-2 gap-8">

                  <div className="w-full flex flex-col gap-2">
                    <ParentPostCard post={post} />
                    {ancestors.map((ancestor) => (
                      <div
                        key={ancestor.id}
                      >
                        <AncestorPostCard postId={post.id} ancestor={ancestor} />
                      </div>
                    ))}
                  </div>

                  <div
                    className="w-full pb-4 border-b border-divider-surface"
                  >
                    <PostContent
                      userId={user.id}
                      postId={postId}
                      commentId={commentId}
                      username={comment.user.username}
                      displayName={comment.user.displayName}
                      avatar={comment.user.avatar ?? undefined}
                      content={comment.content}
                      createdAt={comment.createdAt}
                      attachments={comment.attachments}
                      likesCount={comment.likesCount}
                      commentsCount={comment.repliesCount}
                      isLiked={comment.isLiked}
                      isAuthor={comment.isAuthor}
                      isFollowing={comment.isFollowing}
                      authorType={comment.authorType}
                      isOwner={comment.isOwner}
                      isBookmarked={comment.isBookmarked}
                      bookmarksCount={comment.bookmarksCount}
                      isDeleted={comment.isDeleted}
                      variant="page"
                    />
                  </div>


                  <CommentsList comments={replies} postId={postId}/>

                </div>
              </SurfaceCard>

            </div >
          </main >

          <footer className="w-full shrink-0 px-5 pt-4 border-t border-app-gray">
            <div className="w-full max-w-170 mx-auto mb-12 sm:mb-8 gap-4 flex flex-col items-center">

              {canComment ? (
                <ReplyInput
                  postId={postId}
                  parentId={comment.id}
                />
              ) : (
                <p className="text-sm text-text-muted">
                  {mySpace("posts.postCard.replies.replyWarning")}
                </p>
              )}

            </div>
          </footer>
        </CommentsProvider>

      </BookmarkProvider>
    </>
  )
}