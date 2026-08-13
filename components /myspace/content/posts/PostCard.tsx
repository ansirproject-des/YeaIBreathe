"use client"

import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { Tab } from "@/components /ui/Tab";
import type { getCurrentDbUser } from "@/lib/user/user";
import { PostContent } from "./PostContent";
import { Info as InfoIcon, X } from "lucide-react";
import { IconButton } from "@/components /ui/IconButton";
import { useState } from "react";
import { dismissPostHistoryInfo } from "@/app/actions/user";
import { PostsState } from "./EmptyPosts";
import { PostActions } from "./PostActions";
import { FeedReplyInput } from "./FeedReplyInput";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getPublicProfilePosts } from "@/lib/api/post";
import { BookmarkProvider } from "./PostBookmarkProvider";
import { useTranslations } from "next-intl";

export type PostCardUser = Awaited<ReturnType<typeof getCurrentDbUser>>;

type PostCardProps = {
  user: PostCardUser;
  isFollowing: boolean,
  isOwner: boolean,
  isPublicProfile: boolean,
};

type PostFilter = "all" | "reflection" | "practice" | "tip";

export function PostCard({ user, isFollowing, isOwner, isPublicProfile }: PostCardProps) {

  const mySpace = useTranslations("mySpace");
  const common = useTranslations("common")

  const [showInfo, setShowInfo] = useState(
    !user.postHistoryInfoDismissed
  );
  const [profilePosts, setProfilePosts] = useState<PostFilter>("all");
  const [openedPostId, setOpenedPostId] = useState<string | null>(null);

  const {
    data: posts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: isPublicProfile
      ? ["profile-posts", user.id]
      : ["my-space-posts"],

    queryFn: async () =>
      isPublicProfile
        ? await getPublicProfilePosts(user.id)
        : await getPosts()
  });


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

  const filteredPosts =
    profilePosts === "all"
      ? posts
      : posts.filter((post) => post.type === profilePosts);


  if (posts.length === 0) {
    return <PostsState />;
  }


  const handleDismissInfo = async () => {
    setShowInfo(false);

    await dismissPostHistoryInfo();
  };


  return (
    <>
      <SurfaceCard>
        <div className="w-full flex gap-2 my-2">
          <Tab
            variant="outline"
            active={profilePosts === "all"}
            onClick={() => setProfilePosts("all")}
            size="sm"
            className="w-fit"
            info={!showInfo}
            infoContent={mySpace("posts.tab.allInfo.content")}
          >
            {mySpace("posts.tab.all")}
          </Tab>

          <Tab
            variant="outline"
            active={profilePosts === "reflection"}
            onClick={() => setProfilePosts("reflection")}
            size="sm"
            className="w-fit"
          >
            {mySpace("posts.tab.reflections")}
          </Tab>

          <Tab
            variant="outline"
            active={profilePosts === "practice"}
            onClick={() => setProfilePosts("practice")}
            size="sm"
            className="w-fit"
          >
            {mySpace("posts.tab.practices")}
          </Tab>

          <Tab
            variant="outline"
            active={profilePosts === "tip"}
            onClick={() => setProfilePosts("tip")}
            size="sm"
            className="w-fit"
          >
            {mySpace("posts.tab.tips")}
          </Tab>

        </div>

        {showInfo && (
          <div className="w-full flex justify-between py-2 px-3 mb-3 rounded-xl bg-surface-gray border border-dashed border-divider-gray">
            <div className="flex gap-2 text-sm">
              <InfoIcon className="w-4 h-4 shrink-0 mt-0.5" />
              {mySpace("posts.tab.allInfo.content")}
            </div>
            <IconButton
              variant="textMuted"
              type="button"
              onClick={handleDismissInfo}
              size="fit"
            ><X className="w-4 h-4" />
            </IconButton>
          </div>
        )}


        <div className="w-full flex flex-col gap-5">
          {filteredPosts.map((post, index) => (
            <div
              key={index}
              className="w-full flex flex-col">
              <div
                className={`w-full pb-4 ${index !== filteredPosts.length - 1
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
                    likesCount={post.likesCount}
                    isAuthor={true}
                    commentsCount={post.commentsCount}
                    bookmarksCount={post.bookmarksCount}
                    isLiked={post.isLiked}
                    isFollowing={isFollowing}
                    isBookmarked={post.isBookmarked}
                    onCommentClick={() =>
                      setOpenedPostId(current =>
                        current === post.id ? null : post.id
                      )
                    }
                    isOwner={isOwner}
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

      </SurfaceCard>
    </>
  )
}