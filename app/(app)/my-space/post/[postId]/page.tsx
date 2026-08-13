import { Header } from "@/components /layout/Header";
import { PostContent } from "@/components /myspace/content/posts/PostContent";
import { PostActions } from "@/components /myspace/content/posts/PostActions";
import { BackButton } from "@/components /session/BackButton";
import { getPostById } from "@/lib/post/post";
import { getCurrentDbUser } from "@/lib/user/user";
import { ArrowLeft, } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound, } from "next/navigation";
import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { ReplyInput } from "@/components /myspace/content/posts/ReplyInput";
import { CommentsList } from "@/components /myspace/content/posts/CommentsList";
import { getComments, } from "@/lib/post/comment";
import { CommentsProvider } from "@/components /myspace/content/posts/CommentsProvider";
import { BookmarkProvider } from "@/components /myspace/content/posts/PostBookmarkProvider";


type PostPageProps = {
  params: Promise<{
    postId: string,
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const common = await getTranslations("common");
  const { postId } = await params;
  const user = await getCurrentDbUser();
  const post = await getPostById(postId);
  const comments = await getComments(postId);

  const mySpace = await getTranslations("mySpace");


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
        initialBookmarked={post.isBookmarked}
        initialBookmarks={post.bookmarksCount}
      >
        <div className="w-full shrink-0">
          <Header
            left={
              <BackButton
                href="/my-space"
                loadingChildren={
                  <>
                    <p className="text-sm">{common("loading.label")}</p>
                    <p className="text-base">{common("loading.returning")}</p>
                  </>
                }
              >
                <ArrowLeft className="w-5 h-5" />
              </BackButton>
            }

            center={
              <div className="flex flex-col gap-1">
                <div
                  className="flex flex-col h-12 items-center justify-center font-medium text-lg">
                 {mySpace("posts.header.label")}
                  {post.visibility === "followers_only" && (
                  <div className="text-xs text-center text-text-muted">{mySpace("posts.header.followers_only")}</div>
                )}
                  </div>
              </div>
            }

            right={
              <>
                <PostActions id={postId} isOwner={isOwner} redirectAfterDelete="/my-space" entity="post" postId={postId} />
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
                  <div
                    className="w-full pb-4 border-b border-divider-surface"
                  >

                    <PostContent
                      postId={postId}
                      userId={post.user.id}
                      username={post.user.username}
                      displayName={post.user.displayName}
                      avatar={post.user.avatar ?? undefined}
                      title={post.title ?? undefined}
                      content={post.content ?? undefined}
                      createdAt={post.createdAt}
                      postType={post.type}
                      duration={post.duration ?? undefined}
                      category={post.category ?? undefined}
                      authorType={post.authorType}
                      attachments={post.attachments ?? undefined}
                      likesCount={post.likesCount}
                      commentsCount={post.commentsCount}
                      isLiked={post.isLiked}
                      isOwner={isOwner}
                      isAuthor={true}
                      isFollowing={post.isFollowing}
                      isBookmarked={post.isBookmarked}
                      bookmarksCount={post.bookmarksCount}
                      variant="page"
                    />
                  </div>


                  <CommentsList comments={comments} postId={post.id} />

                </div>
              </SurfaceCard>

            </div >
          </main >

          <footer className="w-full shrink-0 px-5 pt-4 border-t border-app-gray">
            <div className="w-full max-w-170 mx-auto mb-12 sm:mb-8 gap-4 flex flex-col items-center">

              {canComment ? (
                <ReplyInput postId={post.id} parentId={null} />
              ) : (
                <div className="w-full py-3 text-center text-sm text-text-muted">
                  {mySpace("posts.postCard.replies.commentWarning")}
                </div>
              )}

            </div>
          </footer>
        </CommentsProvider>
      </BookmarkProvider>
    </>
  )
}