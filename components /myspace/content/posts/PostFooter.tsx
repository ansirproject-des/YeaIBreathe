"use client"

import { Bookmark, Heart, MessageCircle, SendHorizonal, LucideIcon } from "lucide-react";
import { DbAttachment, type DbPost } from "@/lib/types";
import { PostTags } from "./PostTags";
import { Button } from "@/components /ui/Button";
import { useState } from "react";
import { toggleBookmark, toggleCommentLike, toggleLike, toggleCommentBookmark } from "@/app/actions/posts";
import { ModalTrigger } from "@/components /ui/ModalTrigger";
import { SocialButton } from "@/components /ui/SocialButton";
import { Input } from "@/components /ui/Input";
import { CopyButton } from "@/components /ui/CopyButton";
import { useBookmark } from "./PostBookmarkProvider";
import { useTranslations } from "next-intl";

type FooterButtonVariant = "likes" | "comments" | "bookmarks" | "resend";

type FooterButton = {
  id: FooterButtonVariant,
  icon: LucideIcon,
  count?: number,
  onClick?: () => void,
};

type PostFooterProps = {
  id: string;
  postId?: string,
  entity: "post" | "comment";
  postType?: DbPost["type"],
  category?: string,
  duration?: number,
  attachments?: DbAttachment[],
  likesCount: number,
  content?: string,
  commentsCount: number,
  isLiked: boolean,
  onCommentClick?: () => void,
}

export function PostFooter({ id, postId, content, entity, postType, category, duration, attachments, likesCount, commentsCount, isLiked, onCommentClick, }: PostFooterProps) {

  const [likes, setLikes] = useState(likesCount);
  const [liked, setLiked] = useState(isLiked);

  const mySpace = useTranslations("mySpace");

  const {
    bookmarked,
    setBookmarked,
    bookmarks,
    setBookmarks,
  } = useBookmark();

  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      const result =
        entity === "post"
          ? await toggleLike(id)
          : await toggleCommentLike(id);

      if (result.success) {
        setLiked(result.liked);

        setLikes((prev) =>
          result.liked ? prev + 1 : prev - 1
        );
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleBookmark = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      const result =
        entity === "post"
          ? await toggleBookmark(id)
          : await toggleCommentBookmark(id)

      if (result.success) {
        setBookmarked(result.bookmarked);

        setBookmarks((prev) =>
          result.bookmarked ? prev + 1 : prev - 1
        );
      }
    } finally {
      setIsPending(false);
    }

  }

  const footerButtons: FooterButton[] = [
    {
      id: "likes",
      icon: Heart,
      count: likes,
      onClick: handleLike,
    },
    {
      id: "comments",
      icon: MessageCircle,
      count: commentsCount,
      onClick: onCommentClick,
    },
    {
      id: "bookmarks",
      icon: Bookmark,
      count: bookmarks,
      onClick: handleBookmark,
    },
    {
      id: "resend",
      icon: SendHorizonal,
    },
  ];

  const shareUrl =
  typeof window !== "undefined"
    ? entity === "post"
      ? `${window.location.origin}/post/${id}`
      : `${window.location.origin}/post/${postId}/comment/${id}`
    : "";


  return (
    <>

      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-1 w-full">
          {postType && (
            <PostTags
              variant={postType}
              postContent={content}
              category={category}
              duration={duration}
            />
          )}

          {attachments?.length ? (
            <PostTags
              variant="file"
              postContent={content}
              fileCount={attachments.length}
            />
          ) : null}

        </div>

        <div className="w-full flex justify-between pr-2">
         {footerButtons.map(({ id, icon: Icon, count, onClick }) => {
  if (id === "resend") {
    return (
      <ModalTrigger
        key={id}
        trigger={(open) => (
          <Button
            variant="custom"
            size="smText"
            onClick={open}
            className="text-text-descr hover:text-text"
          >
            <Icon className="size-4.5" />
          </Button>
        )}
      >
        {() => (
          <>
            <div className="w-full mb-6">
              <h3 className="text-xl text-text font-bold">
                {entity === "post"
                  ? mySpace("posts.postCard.share.modalTitlePost")
                  : mySpace("posts.postCard.share.modalTitleComment")}
              </h3>
            </div>

            <div className="flex flex-col w-full gap-8">
              <p>
                {mySpace("posts.postCard.share.message1")}{" "}
                {entity === "post"
                  ? mySpace("posts.postCard.share.messagePost")
                  : mySpace("posts.postCard.share.messageComment")}{" "}
               {mySpace("posts.postCard.share.message2")}
              </p>

              <Input
                readOnly
                label={
                  entity === "post"
                    ? mySpace("posts.postCard.share.shareInputPost")
                    : mySpace("posts.postCard.share.shareInputComment")
                }
                value={shareUrl}
                variant="app"
                endAdornment={
                  <CopyButton text={shareUrl} />
                }
              />

              <div className="flex flex-col gap-4">
                <p className="w-full font-bold">
                  {mySpace("posts.postCard.share.shareButton")}
                </p>

                <div className="w-full flex gap-4 overflow-x-auto hide-scrollbar">
                  <SocialButton
                    url={shareUrl}
                    title="Check out this post!"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </ModalTrigger>
    );
  }

  return (
    <Button
      key={id}
      variant="custom"
      size="smText"
      onClick={onClick}
      className={`flex gap-1 ${
        id === "likes" && liked
          ? "text-danger group-hover:text-danger/80"
          : id === "bookmarks" && bookmarked
            ? "text-tip group-hover:text-tip/80"
            : "text-text-descr hover:text-text"
      }`}
    >
      <Icon
        className={`
          w-4.5 h-4.5
          ${
            id === "likes" && liked
              ? "text-danger fill-current group-hover:text-danger/80"
              : id === "bookmarks" && bookmarked
                ? "text-tip fill-current group-hover:text-tip/80"
                : ""
          }
        `}
      />

      {count !== undefined && count}
    </Button>
  );
})}
        </div>
      </div>

    </>
  )
}