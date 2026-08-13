"use client"

import { Camera } from "lucide-react";
import Image from "next/image";
import { type PostSettings } from "@/lib/types";
import { getS3Url } from "@/lib/s3-url";

type ProfileAvatarProps = {
  avatar?: string,
  displayName: string,
  size?: number,
  className?: string,
  editable?: boolean,
  onEdit?: () => void,
  authorType?: PostSettings["authorType"]
}

export function ProfileAvatar({
  avatar,
  displayName,
  size = 48,
  className = "",
  editable,
  onEdit,
  authorType,
}: ProfileAvatarProps) {

  const isAnonymous = authorType === "anonymous";

  const avatarUrl = avatar ? getS3Url(avatar) : "";

  return (
    <div
      onClick={editable ? onEdit : undefined}
      className={`group relative overflow-hidden rounded-full bg-app-gray ${className} ${editable ? "cursor-pointer" : ""}`}
      style={!className ? { width: size, height: size } : undefined}
    >
      {isAnonymous ? (
        <div className="size-full bg-primary flex items-center justify-center"/>
      ) : avatar ? (
        <Image
          src={avatarUrl}
          alt={displayName}
          fill
          className={`object-cover ${editable ? "hover:blur-[1px]" : ""}`}
          sizes={`${size}px`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      {editable && !isAnonymous && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );

}