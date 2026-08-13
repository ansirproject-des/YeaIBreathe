"use client"

import { IconButton } from "@/components /ui/IconButton";
import { ModalTrigger } from "@/components /ui/ModalTrigger";
import { ChevronDown, Plus } from "lucide-react";
import { Textbox } from "@/components /ui/Textbox";
import { useState } from "react";
import { Button } from "@/components /ui/Button";
import { Tab } from "@/components /ui/Tab";
import { PostSettingsModal } from "./PostSettingsModal";
import { posts, type PostType } from "@/data/posts";
import { categories, type Topic } from "@/data/post/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/app/actions/posts";
import { type PostSettings } from "@/lib/types";
import { Popover } from "@/components /ui/Popover";
import { AttachmentPreview } from "./attachments/AttachmentPreview";
import { AttachmentToolbar } from "./attachments/AttachmentToolbar";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentInputs } from "./attachments/AttachmentInputs";
import { AlertModal } from "@/components /ui/AlertModal";
import { useTranslations } from "next-intl";


export function CreatePostModal() {
  const [content, setContent] = useState("");

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>("reflection");
  const [duration, setDuration] = useState<number | null>(null);
  const [topic, setTopic] = useState<Topic>("productivity");

  const common = useTranslations("common");
  const mySpace = useTranslations("mySpace");

  const {
    state,
    mediaInputRef,
    audioInputRef,
    fileInputRef,
    handlers,
    alertRef,
    uploadAttachments,
  } = useAttachments();


  const [postSettings, setPostSettings] = useState<PostSettings>({
    visibility: "anyone",
    commentPermission: "anyone",
    authorType: "public",
  });

  const currentPost = posts[postType];
  const presetDurations = [10, 20, 30];

  const queryClient = useQueryClient();


  function resetForm() {
    setContent("");
    setTitle("");
    setPostType("reflection");
    setDuration(null);
    setTopic("productivity");
    state.setMedia([]);
    state.setAudio([]);
    state.setFiles([]);

    setPostSettings({
      visibility: "anyone",
      commentPermission: "anyone",
      authorType: "public",
    });
  }

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  async function handleCreatePost(close: () => void) {
    try {
      const attachments = await uploadAttachments();

      createPostMutation.mutate(
        {
          type: postType,
          title: title || undefined,
          content: content.trim() || undefined,
          duration:
            postType === "practice"
              ? duration ?? undefined
              : undefined,
          category:
            postType === "tip"
              ? topic
              : undefined,
          visibility: postSettings.visibility,
          commentPermission: postSettings.commentPermission,
          authorType: postSettings.authorType,

          attachments,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["my-space-posts"]
            })
            resetForm();
            close();
          },
        }
      );
    } catch (error) {
      console.error("UPLOAD_ERROR", error)
    }
  }

  const hasAttachments =
    state.media.length > 0 ||
    state.audio.length > 0 ||
    state.files.length > 0;

  const canPost =
    content.trim().length > 0 ||
    title.trim().length > 0 ||
    hasAttachments;

  return (
    <>
      <AttachmentInputs
        mediaInputRef={mediaInputRef}
        audioInputRef={audioInputRef}
        fileInputRef={fileInputRef}
        handlers={handlers}
      />

      <ModalTrigger
        trigger={(open) => (
          <>
            <div className="hidden sm:block">
              <Popover
                body={mySpace("posts.create.modalTitle")}
                placement="bottom"
                variant="compact"
                align="end"
              >
                <IconButton
                  variant="text"
                  onClick={open}
                >
                  <Plus className="w-5 h-5" />
                </IconButton>
              </Popover>
            </div>

            <div className="sm:hidden">
              <IconButton
                variant="text"
                onClick={open}
              >
                <Plus className="w-5 h-5" />
              </IconButton>
            </div>
          </>
        )}
        footer={(close) => (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between items-end pb-2 border-b-[1.5px] border-app-gray">
              <PostSettingsModal
                settings={postSettings}
                setSettings={setPostSettings}
              />
            </div>
            <div className="w-full flex justify-between">
              <Button variant="text" size="smText" onClick={close}>{common("cancel")}</Button>
              <Button
                onClick={() => handleCreatePost(close)}
                disabled={
                  createPostMutation.isPending ||
                  !canPost
                }
              >
                {createPostMutation.isPending ? mySpace("posts.create.posting") : mySpace("posts.create.post")}
              </Button>
            </div>
          </div>
        )}
      >
        {() => (
          <>
            <div className="w-full mb-4">
              <h3 className="text-xl text-text font-bold">{mySpace("posts.create.modalTitle")}</h3>
            </div>

            <div className="w-full flex flex-col gap-8 mb-24">
              <div className="relative grid grid-cols-3 border-b-[1.5px] border-app-gray">
                <Tab
                  variant="underline"
                  active={postType === "reflection"}
                  onClick={() => setPostType("reflection")}
                  className="w-full"
                >
                  {mySpace("posts.create.tabs.reflection")}
                </Tab>

                <Tab
                  variant="underline"
                  active={postType === "practice"}
                  onClick={() => setPostType("practice")}
                  className="w-full"
                >
                  {mySpace("posts.create.tabs.practice")}
                </Tab>

                <Tab
                  variant="underline"
                  active={postType === "tip"}
                  onClick={() => setPostType("tip")}
                  className="w-full"
                >
                  {mySpace("posts.create.tabs.tip")}
                </Tab>

                <div
                  className={`
                  absolute
                  bottom-0
                  h-[1.5px]
                  w-1/3
                  bg-text
                  transition-transform
                  duration-300
                  ease-in-out
                  ${postType === "reflection"
                      ? "translate-x-0"
                      : postType === "practice"
                        ? "translate-x-full"
                        : "translate-x-[200%]"
                    }
    `}
                />
              </div>

              <div className="w-full flex flex-col gap-6">
                <Textbox
                  value={title}
                  variant="title"
                  onChange={setTitle}
                  maxLength={120}
                  helperIndicator
                  placeholder={mySpace("posts.create.titleInput")}
                />

                <div className="w-full flex flex-col gap-2">
                  <Textbox
                    value={content}
                    variant="post"
                    onChange={setContent}
                    maxLength={1000}
                    helperIndicator
                    autoResize
                    placeholder={mySpace(`posts.create.contentInput.${currentPost.type}`)}
                  />

                  <AttachmentPreview
                    media={state.media}
                    audio={state.audio}
                    files={state.files}
                    setMedia={state.setMedia}
                    setAudio={state.setAudio}
                    setFiles={state.setFiles}
                  />

                  <AttachmentToolbar
                    onMediaClick={() => mediaInputRef.current?.click()}
                    onAudioClick={() => audioInputRef.current?.click()}
                    onFileClick={() => fileInputRef.current?.click()}
                  />

                  {postType === "practice" && (
                    <div className="w-full flex flex-col gap-2">
                      <p className="text-sm">
                        {mySpace("posts.create.duration.label")}
                      </p>

                      <div className="w-full flex overflow-x-auto gap-2">
                        {presetDurations.map((minutes) => (
                          <button
                            key={minutes}
                            type="button"
                            onClick={() => setDuration(minutes)}
                            className={`
                      flex-1
                      shrink-0
                      min-w-20
                      rounded-lg
                      py-2
                      px-3
                      text-sm
                      transition-colors
                      ${duration === minutes
                                ? "bg-primary text-text-inverse"
                                : "bg-app-gray text-text hover:bg-app-gray-hover"
                              }
                        cursor-pointer
                      `}
                          >
                            {minutes} {mySpace("posts.create.duration.min")}
                          </button>
                        ))}


                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            duration !== null && !presetDurations.includes(duration)
                              ? duration
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            if (/^\d*$/.test(value)) {
                              setDuration(value === "" ? null : Number(value));
                            }
                          }}
                          placeholder={mySpace("posts.create.duration.custom")}
                          className={`
                    flex-1
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    text-center
                    shrink-0
                    w-20
                    text-sm
                    transition-colors

                    ${duration !== null && !presetDurations.includes(duration)
                              ? "bg-primary text-text-inverse"
                              : "bg-app-gray text-text hover:bg-app-gray-hover"
                            }
  `}
                        />

                      </div>
                    </div>
                  )}

                  {postType === "tip" && (
                    <div className="w-full flex flex-col gap-2">
                      <p className="text-sm">
                        {mySpace("posts.create.category.label")}
                      </p>

                      <div className="group relative w-full">
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value as Topic)}
                          className="
          
                    w-full
                    h-9
                    appearance-none
                    bg-surface
                    rounded-lg
                    text-sm
                    pl-4
                    pr-10
                    outline-none
                    cursor-pointer
                    group-hover:text-text/80
                  "
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {mySpace(`posts.create.category.${category}`)}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-text-muted
                    group-hover:text-text
                  "
                        />
                      </div>
                    </div>
                  )}

                </div>

                <AlertModal ref={alertRef} />

              </div>
            </div>
          </>
        )}

      </ModalTrigger>
    </>
  )
}