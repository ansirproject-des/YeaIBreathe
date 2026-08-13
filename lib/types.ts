export type DbAttachment = {
  id: string;
  type: "media" | "audio" | "document";
  key: string;
  fileName: string;
  order: number;
};

export type DbUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
};

export type DbPost = {
  id: string,
  user: DbUser,
  type: "reflection" | "practice" | "tip",
  title?: string,
  content: string | null,
  createdAt: string,
  duration?: number,
  category?: string,
  attachments?: DbAttachment[],
  visibility?: "anyone" | "followers_only",
  commentPermission: "anyone" | "followers_only",
  authorType: "public" | "anonymous",

  likesCount: number,
  bookmarksCount: number,
  commentsCount: number,
  isOwner: boolean,

  isLiked: boolean,
  isBookmarked: boolean,
  isFollowing: boolean,
  comments?: DbComment[],
}

export type DbComment = {
  id: string,
  postId: string,
  content: string,
  createdAt: string,
  user: DbUser,
  attachments: DbAttachment[],
  likesCount: number,
  isLiked: boolean,
  isBookmarked: boolean,
  isDeleted: boolean,
  deletedAt: string | null,

  authorType: "public" | "anonymous",
  visibility?: "anyone" | "followers_only",
  commentPermission: "anyone" | "followers_only",
  
  repliesCount: number,
  bookmarksCount: number,
  isOwner: boolean,
  isFollowing: boolean,
  isAuthor: boolean,
};

export type PostSettings = {
  visibility: "anyone" | "followers_only";
  commentPermission: "anyone" | "followers_only";
  authorType: "public" | "anonymous";
};

export type NotificationType =
  | "follow"
  | "like"
  | "comment";

export type DbNotification = {
  id: string;

  targetId: string;
  actorId: string;

  postId: string | null;
  commentId: string | null;

  type: NotificationType;

  isRead: boolean;
  createdAt: string;

  actor: DbUser,
};

export type SavedItem =
  | {
      type: "post",
      data: DbPost,
      savedAt: string,
    }
  | {
      type: "comment",
      data: DbComment,
      savedAt: string,
    };

export function formatTimeAgo(createdAt: Date | string) {
  const createdDate =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  const now = new Date();

  const differenceInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60
  );

  if (differenceInHours < 24) {
    return `${differenceInHours} hr ago`;
  }

  const differenceInDays = Math.floor(
    differenceInHours / 24
  );

  return `${differenceInDays} days ago`;
}