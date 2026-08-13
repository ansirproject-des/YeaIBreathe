"use client"

import { DbPost, } from "@/lib/types"
import { ContentTabs } from "./content/ContentTabs"
import { ProfileCredits } from "./credits/ProfileCredits"
import { PostCardUser } from "./content/posts/PostCard"


type ProfileTabProps = {
  user: PostCardUser,
  posts: DbPost[],
  followersCount: number,
  isOwner: boolean;
  isFollowing: boolean;
}

export function ProfileTab({user, posts, followersCount, isFollowing, isOwner}: ProfileTabProps) {
  return (
    <div className="w-full">
            <div
              className="w-full max-w-170 mx-auto flex flex-col mt-1 mb-8 sm:mt-8 gap-8">
              <ProfileCredits user={user} postsCount={posts.length} followersCount={followersCount} isFollowing={isFollowing} isOwner={isOwner} />
    
              <ContentTabs user={user} isOwner={isOwner} isFollowing={isFollowing} isPublicProfile={false} />
            </div>
          </div>
  )
}