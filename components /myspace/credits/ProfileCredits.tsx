"use client";

import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { EditProfileModal } from "./EditProfileModal";
import { ShareProfileModal } from "./ShareProfileModal";
import { PostCardUser } from "../content/posts/PostCard";
import { Button } from "@/components /ui/Button";
import { toggleFollow } from "@/app/actions/follow";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";


type ProfileCreditsProps = {
  user: PostCardUser,
  postsCount: number,
  followersCount: number,
  isOwner: boolean,
  isFollowing: boolean,
};

export function ProfileCredits({ user, postsCount, followersCount, isOwner, isFollowing }: ProfileCreditsProps) {
  const mySpace = useTranslations("mySpace");

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleFollow = async () => {
    if (!user.id) return;

    const result = await toggleFollow(user.id);

    if (!result.success) return;

    queryClient.invalidateQueries({
      queryKey: ["profile-posts", user.id]
    })


    router.refresh();
  };

  return (
    <div className="w-full flex flex-col px-5 sm:px-0 gap-4">

      <div className="w-full flex gap-4">
        <div className="flex flex-1 flex-col gap-2 my-0.5">
          <div className="flex flex-1 justify-between items-center">
            <ProfileInfo
              name={user.displayName}
              username={`@${user.username}`}
              align="left"
              nameClassName="text-2xl font-bold"
            />
          </div>
        </div>

        <ProfileAvatar
          avatar={user.avatar ?? undefined}
          displayName={user.displayName}
          className="shrink-0 h-16 w-16 sm:h-20 sm:w-20"
        />



      </div>

      <div className="w-full flex flex-col gap-4">
        <p className="w-full max-w-120 leading-relaxed">
          {user.description}
        </p>

        <p className="text-text-muted"> {followersCount} {mySpace("follow.followers")} • {postsCount} {mySpace("posts.postsCount")}</p>

        <div className="w-full flex mt-2 gap-2">
          {isOwner ? (
            <EditProfileModal
              displayName={user.displayName}
              username={user.username}
              email={user.email}
              description={user.description ?? ""}
              links={user.links}
              bio={user.bio ?? ""}
              avatar={user.avatar ?? undefined}
              initialFocus="displayName"
            />
          ) : (
            <Button
              variant={isFollowing ? "secondaryGray" : "primary"}
              onClick={handleFollow}
              size="sm"
              className="w-full"
            >
              {isFollowing ? mySpace("follow.button.following") : mySpace("follow.button.follow")}
            </Button>
          )}

          <ShareProfileModal username={user.username} />

        </div>
      </div>

    </div>
  );
}