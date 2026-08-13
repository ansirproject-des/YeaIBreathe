"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "@/app/actions/posts";
import { useAttachments } from "@/hooks/useAttachments";

import { AttachmentToolbar } from "./createPost/attachments/AttachmentToolbar";
import { AttachmentInputs } from "./createPost/attachments/AttachmentInputs";
import { AttachmentPreview } from "./createPost/attachments/AttachmentPreview";
import { Button } from "@/components /ui/Button";
import { PostSettings } from "@/lib/types";
import { PostSettingsModal } from "./createPost/PostSettingsModal";
import { AlertModal } from "@/components /ui/AlertModal";
import { useTranslations } from "next-intl";

type FeedReplyInputProps = {
  postId: string,
  parentId: string | null,
  onClose: () => void,
};

export function FeedReplyInput({
  postId,
  parentId,
  onClose,
}: FeedReplyInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();


  const mySpace = useTranslations("mySpace");

  const [postSettings, setPostSettings] = useState<PostSettings>({
    visibility: "anyone",
    commentPermission: "anyone",
    authorType: "public",
  });

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


  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["saved-posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["feed"]
        }),
      ]);

      setContent("");

      setPostSettings({
        visibility: "anyone",
        commentPermission: "anyone",
        authorType: "public",
      });

      clearAttachments();
      onClose();
    },
  });

  async function handleCreateComment() {
    try {
      const attachments = await uploadAttachments();

      createCommentMutation.mutate({
        postId,
        parentId,
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
    content.trim().length > 0 || hasAttachments;

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

      <div className="mt-3 rounded-2xl bg-surface border border-surface-gray hover:border-surface-gray-hover px-3 py-3 transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={mySpace("posts.postCard.replies.commentPlaceholder")}
          maxLength={100}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full resize-none outline-none"
        />


        <AttachmentPreview
          media={state.media}
          audio={state.audio}
          files={state.files}
          setMedia={state.setMedia}
          setAudio={state.setAudio}
          setFiles={state.setFiles}
        />

        <div className="mt-3 flex justify-between">
          <div className="flex gap-2">
            <AttachmentToolbar
              onMediaClick={() => mediaInputRef.current?.click()}
              onAudioClick={() => audioInputRef.current?.click()}
              onFileClick={() => fileInputRef.current?.click()}
            />


            <PostSettingsModal setSettings={setPostSettings} settings={postSettings} />

          </div>

          <div className="flex gap-4">

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
                : mySpace("posts.postCard.replies.post")}
            </Button>
          </div>
        </div>

        <AlertModal ref={alertRef} />
      </div>
    </>
  );
}