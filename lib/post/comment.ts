import { prisma } from "../prisma";
import { getCurrentDbUser } from "../user/user";
import { mapComment, } from "./mapper";
import { DbComment } from "../types";

export async function getComments(postId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const comments = await prisma.postComment.findMany({
      where: {
        postId,
        parentId: null,
        OR: [
          {
            isDeleted: false,
          },
          {
            isDeleted: true,
            replies: {
              some: {},
            },
          },
        ],
      },
      include: {
        user: {
          include: {
            followers: true,
          }
        },
        post: {
          select: {
            userId: true,
          },
        },
        attachments: true,
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            replies: true,
            postBookmarks: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc"
      },
    });

    const dbComments: DbComment[] = comments.map((comment) => (
      mapComment(comment, user.id, post.userId)
    ));

    return dbComments;
  } catch (error) {
    console.error("GET_COMMENTS_ERROR", error);
    throw error;
  }
}

export async function getReplies(commentId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const parentComment = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!parentComment) {
      throw new Error("Comment not found");
    }

    const replies = await prisma.postComment.findMany({
      where: {
        parentId: commentId,
      },
      include: {
        user: {
          include: {
            followers: true,
          }
        },
        post: {
          select: {
            userId: true,
          },
        },
        attachments: true,
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            replies: true,
            postBookmarks: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc"
      },
    })

    const dbReplies: DbComment[] = replies.map((reply) => (
      mapComment(reply, user.id, parentComment.post.userId)
    ));

    return dbReplies;
  } catch (error) {
    console.error("GET_REPLIES_ERROR", error);
    throw error;
  }
}

export async function getCommentById(id: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const comment = await prisma.postComment.findUnique({
      where: {
        id,
      },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
        attachments: true,
        user: {
          include: {
            followers: true,
          },
        },
        likes: true,
        postBookmarks: true,
        _count: {
          select: {
            replies: true,
            postBookmarks: true,
          },
        },
      },
    });

    if (!comment) {
      console.error("No comment is found");
      return null;
    }

    return mapComment(comment, user.id, comment.post.userId);

  } catch (error) {
    console.error("GET_COMMENT_ERROR", error);
    throw error;
  }
}

export async function getCommentAncestors(
  commentId: string
): Promise<DbComment[]> {
  const user = await getCurrentDbUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.postComment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          userId: true,
        },
      },
      user: {
        include: {
          followers: true,
        }
      },
      attachments: true,
      likes: true,
      postBookmarks: true,
      _count: {
        select: {
          replies: true,
          postBookmarks: true,
        },
      },
      parent: {
        include: {
          user: {
            include: {
              followers: true,
            }
          },
          post: {
            select: {
              userId: true,
            },
          },
          attachments: true,
          likes: true,
          postBookmarks: true,
          _count: {
            select: {
              replies: true,
              postBookmarks: true,
            },
          },
        },
      },
    },
  });

  if (!comment || !comment.parent) {
    return [];
  }

  const ancestors = await getCommentAncestors(comment.parent.id);

  return [
    ...ancestors,
    mapComment(comment.parent, user.id, comment.post.userId),
  ];
}