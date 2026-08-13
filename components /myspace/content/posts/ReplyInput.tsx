"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "@/app/actions/posts";
import { useAttachments } from "@/hooks/useAttachments";
import { useComments } from "./CommentsProvider";

import { AttachmentToolbar } from "./createPost/attachments/AttachmentToolbar";
import { AttachmentInputs } from "./createPost/attachments/AttachmentInputs";
import { AttachmentPreview } from "./createPost/attachments/AttachmentPreview";
import { Button } from "@/components /ui/Button";
import { useRouter } from "next/navigation";
import { PostSettingsModal } from "./createPost/PostSettingsModal";
import { PostSettings } from "@/lib/types";
import { AlertModal } from "@/components /ui/AlertModal";
import { useTranslations } from "next-intl";

type ReplyInputProps = {
  postId: string,
  parentId: string | null,
};

export function ReplyInput({ postId, parentId }: ReplyInputProps) {
  const mySpace = useTranslations("mySpace");
  const common = useTranslations("common");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");

  const [postSettings, setPostSettings] = useState<PostSettings>({
    visibility: "anyone",
    commentPermission: "anyone",
    authorType: "public",
  });

  const { replyTarget, setReplyTarget } = useComments();
  const router = useRouter();

  const {
    state,
    mediaInputRef,
    audioInputRef,
    fileInputRef,
    handlers,
    alertRef,
    uploadAttachments,
    clearAttachments,
  } = useAttachments();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      router.refresh();

      if (replyTarget?.id || parentId) {
        await queryClient.invalidateQueries({
          queryKey: ["replies", replyTarget?.id ?? parentId],
        });
      }

      setContent("");
      clearAttachments();
      setReplyTarget(null);
      setPostSettings({
        visibility: "anyone",
        commentPermission: "anyone",
        authorType: "public",
      });
    },
  });

  async function handleCreateComment() {
    try {
      const attachments = await uploadAttachments();

      createCommentMutation.mutate({
        postId,
        parentId: replyTarget?.id ?? parentId ?? null,
        content,
        attachments,
        visibility: postSettings.visibility,
        commentPermission: postSettings.commentPermission,
        authorType: postSettings.authorType,
      });
    } catch (error) {
      console.error("UPLOAD_ERROR", error);
    }
  }

  const hasAttachments =
    state.media.length > 0 ||
    state.audio.length > 0 ||
    state.files.length > 0;

  const canPost =
    content.trim().length > 0 ||
    hasAttachments;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      canPost &&
      !createCommentMutation.isPending
    ) {
      e.preventDefault(); // Prevent adding a new line
      handleCreateComment();
    }
  }

  return (
    <>
      <AttachmentInputs
        mediaInputRef={mediaInputRef}
        audioInputRef={audioInputRef}
        fileInputRef={fileInputRef}
        handlers={handlers}
      />

      <div className="w-full flex-col gap-3 justify-between rounded-2xl bg-surface border border-transparent hover:border-surface-midgray-hover transition-all duration-200 cursor-pointer px-3 py-3">
        {replyTarget && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-midgray border border-surface-gray px-3 py-2 text-sm">
            <span>
              {mySpace("posts.postCard.replies.replyingTo")}{" "}
              <strong className="text-tip">
                @{replyTarget.authorType === "anonymous"
                  ? "anonymous"
                  : replyTarget.username}
              </strong>
            </span>

            <Button
              variant="text"
              size="smText"
              type="button"
              onClick={() => setReplyTarget(null)}
            >
              {common("cancel")}
            </Button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          onKeyDown={handleKeyDown}
          maxLength={100}
          placeholder={
            replyTarget ? mySpace("posts.postCard.replies.replyPlaceholder") : mySpace("posts.postCard.replies.commentPlaceholder")
          }
          className="resize-none outline-none w-full"
        />

        <AttachmentPreview
          media={state.media}
          audio={state.audio}
          files={state.files}
          setMedia={state.setMedia}
          setAudio={state.setAudio}
          setFiles={state.setFiles}
        />

        <div className="w-full flex justify-between">
          <div className="flex gap-4">
            <AttachmentToolbar
              onMediaClick={() => mediaInputRef.current?.click()}
              onAudioClick={() => audioInputRef.current?.click()}
              onFileClick={() => fileInputRef.current?.click()}
            />


            <PostSettingsModal setSettings={setPostSettings} settings={postSettings} />

          </div>

          <Button
            size="sm"
            onClick={handleCreateComment}
            disabled={
              createCommentMutation.isPending ||
              !canPost
            }
          >
            {createCommentMutation.isPending
              ? mySpace("posts.postCard.replies.posting")
              : replyTarget
                ? mySpace("posts.postCard.replies.reply")
                : mySpace("posts.postCard.replies.post")}
          </Button>

          <AlertModal ref={alertRef} />
        </div>
      </div>
    </>
  );
}