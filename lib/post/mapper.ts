import { Prisma } from "@/app/generated/prisma/client";
import { DbComment, DbNotification, DbPost } from "../types";

type PrismaCommentPayload = Prisma.PostCommentGetPayload<{
  include: {
    user: {
      include: {
        followers: true,
      }
    },
    attachments: true;
    postBookmarks: true;
    likes: true;
    _count: {
      select: {
        replies: true;
        postBookmarks: true;
      };
    };
  };
}>;

type PrismaPostDetailsPayload = Prisma.PostGetPayload<{
  include: {
    attachments: true;
    user: {
      include: {
        followers: true,
      }
    }
    postBookmarks: true;
    likes: true;
    _count: {
      select: {
        comments: true,
        postBookmarks: true,
      },
    },
  };
}>;

type PrismaFeedPostPayload = Prisma.PostGetPayload<{
  include: {
    attachments: true,
    user: {
      include: {
        followers: true,
      }
    }
    likes: true,
    postBookmarks: true,
    _count: {
      select: {
        comments: true,
        postBookmarks: true,
      },
    },
  }
}>

type PrismaNotificationPayload = Prisma.NotificationGetPayload<{
  include: {
  actor: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
    },
  },
}
}>


export function mapComment(
  comment: PrismaCommentPayload,
  currentUserId: string,
  postAuthorId: string,
): DbComment {
  return {
    id: comment.id,
    postId: comment.postId,
    content: comment.content ?? "",
    createdAt: comment.createdAt.toISOString(),

    user: {
      id: comment.user.id,
      username: comment.user.username,
      displayName: comment.user.displayName,
      avatar: comment.user.avatar,
    },

    attachments: comment.attachments.map((attachment) => ({
      id: attachment.id,
      key: attachment.key,
      fileName: attachment.fileName,
      type: attachment.type,
      order: attachment.order,
    })),

    likesCount: comment.likes.length,
    repliesCount: comment._count.replies,
    bookmarksCount: comment._count.postBookmarks,

    authorType: comment.authorType,
    visibility: comment.visibility,
    commentPermission: comment.commentPermission,

    isDeleted: comment.isDeleted,
    deletedAt: comment.deletedAt?.toISOString() ?? null,

    isLiked: comment.likes.some(
      (like) => like.userId === currentUserId
    ),

    isFollowing: comment.user.followers.some(
      follower => follower.followerId === currentUserId
    ),

    isOwner: comment.userId === currentUserId,
    isAuthor: comment.userId === postAuthorId,
    isBookmarked: comment.postBookmarks.some(
      (bookmark) => bookmark.userId === currentUserId
    ),
  };
}

export function mapPostDetails(
  post: PrismaPostDetailsPayload,
  currentUserId: string)
  : DbPost {
  return {
    id: post.id,

    user: {
      id: post.user.id,
      username: post.user.username,
      displayName: post.user.displayName,
      avatar: post.user.avatar,
    },

    type: post.type,
    title: post.title ?? undefined,
    content: post.content ?? "",
    createdAt: post.createdAt.toISOString(),

    duration: post.duration ?? undefined,
    category: post.category ?? undefined,

    attachments: post.attachments,

    visibility: post.visibility,
    commentPermission: post.commentPermission,
    authorType: post.authorType,

    likesCount: post.likes.length,
    commentsCount: post._count.comments,
    bookmarksCount: post._count.postBookmarks,

    isOwner: post.userId === currentUserId,

    isLiked: post.likes.some(
      (like) => like.userId === currentUserId
    ),

    isFollowing: post.user.followers.some(
      follower => follower.followerId === currentUserId
    ),

    isBookmarked: post.postBookmarks.some(
      (bookmark) => bookmark.userId === currentUserId
    ),
  };
}

export function mapFeedPost(
  post: PrismaFeedPostPayload,
  currentUserId: string)
  : DbPost {
  return {
    id: post.id,

    user: {
      id: post.user.id,
      username: post.user.username,
      displayName: post.user.displayName,
      avatar: post.user.avatar,
    },

    type: post.type,
    title: post.title ?? undefined,
    content: post.content ?? "",
    createdAt: post.createdAt.toISOString(),

    duration: post.duration ?? undefined,
    category: post.category ?? undefined,

    attachments: post.attachments,

    visibility: post.visibility,
    commentPermission: post.commentPermission,
    authorType: post.authorType,

    likesCount: post.likes.length,
    commentsCount: post._count.comments,
    bookmarksCount: post._count.postBookmarks,

    isOwner: post.userId === currentUserId,

    isLiked: post.likes.some(
      like => like.userId === currentUserId
    ),

    isFollowing: post.user.followers.some(
      follower => follower.followerId === currentUserId
    ),

    isBookmarked: post.postBookmarks.some(
      (bookmark) => bookmark.userId === currentUserId
    ),
  }
}

export function mapNotification(
  notification: PrismaNotificationPayload,
): DbNotification {
  return {
   id: notification.id,
    targetId: notification.targetId,
    actorId: notification.actorId,
    postId: notification.postId,
    commentId: notification.commentId,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),

    actor: {
      id: notification.actor.id,
      username: notification.actor.username,
      displayName: notification.actor.displayName,
      avatar: notification.actor.avatar,
    },
  };
}