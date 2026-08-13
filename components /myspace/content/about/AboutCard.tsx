"use client"

import { Button } from "@/components /ui/Button";
import { Plus } from "lucide-react";
import { EditProfileModal } from "../../credits/EditProfileModal";
import { LinkRow } from "@/components /ui/LinkRow";
import { ProfileLinksModal } from "../../credits/ProfileLinksModal";
import { useLocale, useTranslations } from "next-intl";
import { PostCardUser } from "../posts/PostCard";

type AboutCardProps = {
  user: PostCardUser,
  isOwner: boolean,
}

export function AboutCard({ user, isOwner }: AboutCardProps) {
  const locale = useLocale();

  const mySpace = useTranslations("mySpace");

  const joinedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="w-full flex flex-col px-5 gap-5">
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">{mySpace("about.aboutLabel")}</p>
        <p>
          {user.bio ? (
            user.bio
          ) : isOwner ? (
            <EditProfileModal
              username={user.username}
              displayName={user.displayName}
              email={user.email}
              trigger={(open) => (
                <Button
                  onClick={open}
                  className="flex gap-1 w-fit"
                  size="sm"
                >
                  <Plus className="w-4.5 h-4.5" />
                  {mySpace("about.addBio")}
                </Button>
              )}
              initialFocus="bio"
            />
          )
            : "—"
          }
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">{mySpace("about.linksLabel")}</p>
        {user.links.length === 0 ? (
          isOwner ? (
            <ProfileLinksModal
              links={user.links}
              trigger={(open) => (
                <Button
                  onClick={open}
                  className="flex gap-1 w-fit"
                  size="sm"
                >
                  <Plus className="w-4.5 h-4.5" />
                  {mySpace("about.addLink")}
                </Button>
              )}
            />
          ) : "—"
        ) : (
          user.links.map((link) => (
            <LinkRow
              id={link.id}
              key={link.id}
              title={link.title ?? ""}
              url={link.url}
            />
          ))
        )}

      </div>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">{mySpace("about.infoLabel")}</p>
        <p>{mySpace("about.joined")} {joinedDate}</p>
      </div>
    </div>
  )
}