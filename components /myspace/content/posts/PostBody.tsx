"use client"

import { Button } from "@/components /ui/Button";
import { useRef, useEffect, useState } from "react";
import Linkify from "linkify-react";
import { DbAttachment } from "@/lib/types";
import { getS3Url } from "@/lib/s3-url";
import Image from "next/image";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type PostBodyProps = {
  content?: string,
  title?: string,
  attachments?: DbAttachment[],
  expanded?: boolean,
}

export function PostBody({ title, content, attachments, expanded = false, }: PostBodyProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const mySpace = useTranslations("mySpace");

  const imageAttachments = attachments?.filter(
    (attachment) =>
      attachment.type === "media" &&
      /\.(jpe?g|png|gif|webp|avif)$/i.test(attachment.fileName)
  );

  const videoAttachments = attachments?.filter(
    (attachment) =>
      attachment.type === "media" &&
      /\.(mp4|webm|mov)$/i.test(attachment.fileName)
  );

  const audioAttachments = attachments?.filter(
    ({ type }) => type === "audio"
  );

  const fileAttachments = attachments?.filter(
    ({ type }) => type === "document"
  );

  useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const checkTruncation = () => {
      setIsTruncated(
        element.scrollHeight > element.clientHeight
      );
    };

    // Check immediately
    checkTruncation();

    // Check again whenever the element changes size
    const observer = new ResizeObserver(() => {
      checkTruncation();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [content]);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        {title && (
          <p className="font-bold">
            {title}
          </p>
        )}

        <div>
          <p
            ref={contentRef}
            className={`
            overflow-hidden
            wrap-break-word
            whitespace-pre-wrap
            [display:-webkit-box]
            [-webkit-box-orient:vertical]
            ${!expanded && !isExpanded && "line-clamp-2"}
          `}
          >
            <Linkify
              options={{
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "text-practice hover:opacity-80 break-all",
              }}
            >
              {content}
            </Linkify>
          </p>

          {!expanded && isTruncated && !isExpanded &&
            <Button
              variant="custom"
              size="defaultText"
              className="text-text-absent p-0 font-normal"
              onClick={() => setIsExpanded(true)}
            >
              {mySpace("posts.postCard.more")}
            </Button>
          }

          {imageAttachments?.map((attachment) => (
            <div
              key={attachment.id}
              className="mt-3 overflow-hidden rounded-2xl"
            >
              <Image
                src={getS3Url(attachment.key)}
                alt={attachment.fileName}
                width={1200}
                height={1200}
                className="w-full max-h-150 h-auto object-cover cursor-pointer"
                onClick={() => setSelectedImage(getS3Url(attachment.key))}
              />
            </div>
          ))}

          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <Image
                src={selectedImage}
                alt="Preview"
                width={1400}
                height={1400}
                className="max-h-[90vh] w-auto rounded-3xl object-contain"
              />
            </div>
          )}

          {videoAttachments?.map((attachment) => (
            <div
              key={attachment.id}
              className="mt-3 overflow-hidden rounded-2xl"
            >
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-150 rounded-2xl"
                src={getS3Url(attachment.key)}
              />
            </div>
          ))}

          {audioAttachments?.map((attachment) => (
            <audio
              key={attachment.id}
              controls
              src={getS3Url(attachment.key)}
              className="mt-3 w-full"
            />
          ))}

          {fileAttachments?.map((attachment) => (
            <a
              key={attachment.id}
              href={getS3Url(attachment.key)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 flex items-center gap-3 rounded-xl p-3 bg-surface-midgray"
            >
              <FileText className="size-5" />

              <div className="flex flex-col">
                <span className="font-medium text-sm">{attachment.fileName}</span>
                <span className="text-sm text-text-muted group-hover:text-text duration-200 transition-all">
                  {mySpace("posts.postCard.file")}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </>
  )
}