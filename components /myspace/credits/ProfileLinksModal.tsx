"use client";

import { useState } from "react";
import { z } from "zod";

import { SettingsRow } from "@/components /settings/SettingsRow";
import { Button } from "@/components /ui/Button";
import { Input } from "@/components /ui/Input";
import { LinkRow } from "@/components /ui/LinkRow";
import { MessageWrapper } from "@/components /ui/MessageWrapper";
import { ModalTrigger } from "@/components /ui/ModalTrigger";
import { addProfileLink } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const linkSchema = z.object({
  url: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error: "Please enter a valid URL.",
  }),
});

type Link = {
  id: string,
  title: string | null,
  url: string,
};

type ProfileLinksModalProps = {
  links: Link[],
  trigger?: (open: () => void) => React.ReactNode,
};

export function ProfileLinksModal({ links: initialLinks, trigger }: ProfileLinksModalProps) {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();
  const mySpace = useTranslations("mySpace")


  function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (
      !/^https?:\/\//i.test(trimmed) &&
      trimmed.includes(".")
    ) {
      return `https://${trimmed}`;
    }

    return trimmed;
  }

  async function handleAddLink() {
  if (isAdding) return;

  try {
    setError("");
    setIsAdding(true);

    const normalizedUrl = normalizeUrl(url);

    const result = linkSchema.safeParse({
      url: normalizedUrl,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const response = await addProfileLink({
      title: title.trim() || undefined,
      url: normalizedUrl,
    });

    if (!response.success) {
      setError(response.message ?? "Something went wrong.");
      return;
    }

    if (!response.link) {
      setError("Failed to save link.");
      return;
    }

    setLinks((prev) => [...prev, response.link]);

    setUrl("");
    setTitle("");

    router.refresh();
  } finally {
    setIsAdding(false);
  }
}

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLink();
    }
  }

  return (
    <ModalTrigger
      trigger={
        trigger ??
        ((open) => (
          <SettingsRow
            title={mySpace("edit.links.label")}
            value={links.length || undefined}
            showBorder={false}
            onClick={open}
          />
        ))}
    >
      {() => (
        <>
          <div className="w-full mb-6">
            <h3 className="text-xl font-bold text-text">
              {mySpace("edit.links.modalTitle")}
            </h3>
          </div>

          <div className="w-full flex flex-col gap-8">
            <MessageWrapper
              message={mySpace("edit.links.linkHint")}
            >
              <div className="flex flex-col gap-1">
                <Input
                  type="url"
                  variant="app"
                  placeholder="https://example.com"
                  value={url}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setUrl(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="off"
                  helperText={error}
                  helperVariant={error ? "error" : "default"}
                  helperIndicator
                />

                <div className="flex w-full gap-1">
                  <Input
                    variant="app"
                    placeholder={mySpace("edit.links.titleInput")}
                    value={title}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                  />

                  <Button
                    type="button"
                    className="w-32"
                    onClick={handleAddLink}
                    disabled={!url || isAdding}
                  >
                    {isAdding ? mySpace("edit.links.addLink.pending") : mySpace("edit.links.addLink.default")}
                  </Button>
                </div>
              </div>
            </MessageWrapper>


            <div className="flex flex-col gap-4">
              {links.map((link, index) => (
                <LinkRow
                  id={link.id}
                  key={link.id}
                  title={link.title ?? ""}
                  url={link.url}
                  showBorder={index !== links.length - 1}
                  showRemoveButton
                  onRemove={() => {
                    setLinks((prev) =>
                      prev.filter((item) => item.id !== link.id)
                    );
                  }}
                />
              ))}
            </div>


          </div>
        </>
      )}
    </ModalTrigger>
  );
}