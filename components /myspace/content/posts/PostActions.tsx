"use client"

import { deleteComment, deletePost, toggleBookmark, toggleCommentBookmark } from "@/app/actions/posts"
import { SettingsRow } from "@/components /settings/SettingsRow"
import { Dropdown } from "@/components /ui/Dropdown"
import { IconButton } from "@/components /ui/IconButton"
import { ModalTrigger } from "@/components /ui/ModalTrigger"
import { SurfaceCard } from "@/components /ui/SurfaceCard"
import { useQueryClient } from "@tanstack/react-query"
import { Ellipsis } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useBookmark } from "./PostBookmarkProvider"
import { useTranslations } from "next-intl"

type PostActionsProps = {
  id: string,
  postId: string,
  entity: "post" | "comment"
  isOwner: boolean,
  redirectAfterDelete?: string,
}

export function PostActions({ id, postId, isOwner, entity, redirectAfterDelete, }: PostActionsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const mySpace = useTranslations("mySpace");

  const {
    bookmarked,
    setBookmarked,
    setBookmarks,
  } = useBookmark();


  const shareUrl =
    typeof window !== "undefined"
      ? entity === "post"
        ? `${window.location.origin}/post/${id}`
        : `${window.location.origin}/post/${postId}/comment/${id}`
      : "";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  async function handleDelete() {
    try {
      const result =
        entity === "post"
          ? await deletePost(id)
          : await deleteComment(id);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["saved-posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["feed"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["replies"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
      ]);

      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
      }

    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  const handleBookmark = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      const result =
        entity === "post"
          ? await toggleBookmark(id)
          : await toggleCommentBookmark(id);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      setBookmarked(result.bookmarked);

      setBookmarks((prev) =>
        result.bookmarked ? prev + 1 : prev - 1
      );

    } catch (error) {
      console.error("Bookmark failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  const items = [
    {
      label:  mySpace("posts.postCard.settings.copy"),
      variant: "default" as const,
      onClick: handleCopyLink,
    },
    {
      label: bookmarked ? mySpace("posts.postCard.settings.unsave") : mySpace("posts.postCard.settings.save"),
      variant: "default" as const,
      onClick: handleBookmark,
    },
    ...(isOwner
      ? [
        {
          label: mySpace("posts.postCard.settings.delete"),
          variant: "danger" as const,
          onClick: handleDelete,
        },
      ]
      : []),
  ];

  return (
    <>
      <div className="hidden sm:block">
        <Dropdown align="right" items={items}>
          <IconButton variant="textMuted">
            <Ellipsis className="size-5" />
          </IconButton>
        </Dropdown>
      </div>

      <div className="block sm:hidden">
        <ModalTrigger
          trigger={(open) => (
            <IconButton
              variant="textMuted"
              onClick={open}
            ><Ellipsis className="size-5" /></IconButton>
          )}
        >
          {() => (
            <>
              <SurfaceCard>

                <SettingsRow
                  title={mySpace("posts.postCard.settings.copy")}
                  showBorder
                  rightIcon="none"
                  onClick={handleCopyLink}
                ></SettingsRow>

                <SettingsRow
                  title={bookmarked ? mySpace("posts.postCard.settings.unsave") :mySpace("posts.postCard.settings.save")}
                  showBorder={isOwner}
                  rightIcon="none"
                  onClick={handleBookmark}
                ></SettingsRow>

                {isOwner && (
                  <SettingsRow
                    title={mySpace("posts.postCard.settings.delete")}
                    showBorder={false}
                    variant="danger"
                    rightIcon="none"
                    onClick={handleDelete}
                  ></SettingsRow>
                )}

              </SurfaceCard>
            </>
          )}
        </ModalTrigger>
      </div>
    </>
  )
}