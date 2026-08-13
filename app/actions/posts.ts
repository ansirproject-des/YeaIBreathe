"use server"

import { createNotification } from "@/lib/notification/notification";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { getCurrentDbUser } from "@/lib/user/user";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import z from "zod";

const createPostSchema = z.object({
  type: z.enum(["reflection", "practice", "tip"]),
  title: z.string().optional(),
  content: z.string().optional(),
  duration: z.number().optional(),
  category: z.string().optional(),
  visibility: z.enum(["anyone", "followers_only"]).optional(),
  commentPermission: z.enum(["anyone", "followers_only"]),
  authorType: z.enum(["public", "anonymous"]),

  attachments: z.array(
    z.object({
      key: z.string(),
      fileName: z.string(),
      type: z.enum(["media", "audio", "document"]),
    })
  ).default([]),
});

const createCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().nullable().optional(),
  content: z.string().optional(),
  visibility: z.enum(["anyone", "followers_only"]).optional(),
  commentPermission: z.enum(["anyone", "followers_only"]),
  authorType: z.enum(["public", "anonymous"]),
  attachments: z.array(
    z.object({
      key: z.string(),
      fileName: z.string(),
      type: z.enum(["media", "audio", "document"]),
    })
  ).default([]),
})



export async function createPost(data: unknown) {
  try {
    const result = createPostSchema.safeParse(data);

    if (!result.success) {
      throw new Error("Invalid post data");
    }

    const hasContent =
      !!result.data.title?.trim() ||
      !!result.data.content?.trim() ||
      result.data.attachments.length > 0;

    if (!hasContent) {
      throw new Error(
        "A post must contain text or at least one attachment."
      );
    }
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { attachments, ...postData } = result.data;

    return prisma.post.create({
      data: {
        userId: user.id,
        ...postData,

        attachments: {
          create: attachments.map((attachment, index) => ({
            type: attachment.type,
            key: attachment.key,
            fileName: attachment.fileName,
            order: index,
          })),
        },
      },
    });
  } catch (error) {
    console.error("CREATE_POST_ERROR", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    const user = await getCurrentDbUser()

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const post = await prisma.post.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        attachments: true,
      },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (post.attachments.length > 0) {
      const result = await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Delete: {
            Objects: post.attachments.map((attachment) => ({
              Key: attachment.key,
            })),
          },
        })
      );
      if (result.Errors?.length) {
        throw new Error("Failed to delete one or more S3 objects.");
      }
    }

    await prisma.post.delete({
      where: {
        id: post.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to remove post", error);

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function toggleLike(postId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        liked: false,
        error: "Unauthorized",
      };
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      revalidatePath("/my-space");
      revalidatePath(`/my-space/post/${postId}`);

      return {
        success: true,
        liked: false,
      };
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
      return {
        success: false,
        liked: false,
        error: "Post not found",
      };
    }

    await prisma.postLike.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    await createNotification({
      targetId: post.userId,
      actorId: user.id,
      type: "like",
      postId,
    })

    revalidatePath("/my-space");
    revalidatePath(`/my-space/post/${postId}`);

    return {
      success: true,
      liked: true,
    };
  } catch (error) {
    console.error("TOGGLE_LIKE_ERROR", error);

    return {
      success: false,
      error: "Failed to toggle like",
      liked: false,
    };
  }
}

export async function toggleCommentLike(commentId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        liked: false,
        error: "Unauthorized",
      };
    }

    const comment = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        postId: true,
      },
    });

    if (!comment) {
      return {
        success: false,
        liked: false,
        error: "Comment not found",
      };
    }

    const existingLike = await prisma.postCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (existingLike) {
      await prisma.postCommentLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      revalidatePath("/my-space");
      revalidatePath(`/my-space/post/${comment.postId}`);

      return {
        success: true,
        liked: false,
      };
    }

    await prisma.postCommentLike.create({
      data: {
        userId: user.id,
        commentId,
      },
    });

    revalidatePath("/my-space");
    revalidatePath(`/my-space/post/${comment.postId}`);

    return {
      success: true,
      liked: true,
    };
  } catch (error) {
    console.error("TOGGLE_COMMENT_LIKE_ERROR", error);

    return {
      success: false,
      liked: false,
      error: "Failed to toggle comment like",
    };
  }
}

export async function createComment(data: unknown) {
  try {
    const result = createCommentSchema.safeParse(data);

    if (!result.success) {
      throw new Error("Invalid comment data");
    };

    const hasContent =
      !!result.data.content?.trim() ||
      result.data.attachments.length > 0;

    if (!hasContent) {
      throw new Error(
        "A comment must contain text or at least one attachment."
      );
    };

    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: result.data.postId
      }
    })

    if (!post) {
      throw new Error("Post not found");
    }

    const { attachments, postId, ...commentData } = result.data;


    const comment = await prisma.postComment.create({
      data: {
        userId: user.id,
        postId,
        ...commentData,
        attachments: {
          create: attachments.map((attachment, index) => ({
            key: attachment.key,
            fileName: attachment.fileName,
            type: attachment.type,
            order: index,
          })),
        },
      },
    });

    await createNotification({
      targetId: post.userId,
      actorId: user.id,
      type: "comment",
      postId,
      commentId: comment.id,
    });

    revalidatePath(`/my-space/post/${postId}`);

    return comment;

  } catch (error) {
    console.error("CREATE_COMMENT_ERROR", error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const comment = await prisma.postComment.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        postId: true,
        attachments: {
          select: {
            key: true,
          },
        },
      },
    });

    if (!comment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    const repliesCount = await prisma.postComment.count({
      where: {
        parentId: comment.id,
      },
    });

    if (comment.attachments.length > 0) {
      const result = await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Delete: {
            Objects: comment.attachments.map((attachment) => ({
              Key: attachment.key,
            })),
          },
        })
      );

      if (result.Errors?.length) {
        throw new Error("Failed to delete one or more S3 objects.");
      }
    }

    if (repliesCount === 0) {
      await prisma.postComment.delete({
        where: {
          id: comment.id,
        },
      });
    } else {
      await prisma.postComment.update({
        where: {
          id: comment.id,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          content: null,
        },
      });

      await prisma.postCommentAttachment.deleteMany({
        where: {
          commentId: comment.id,
        },
      });
    }

    revalidatePath(`/my-space/post/${comment.postId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to remove comment", error);

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function toggleBookmark(postId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        bookmarked: false,
        error: "Unauthorized",
      };
    }

    const existingBookmark = await prisma.postBookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      }
    });

    if (existingBookmark) {
      await prisma.postBookmark.delete({
        where: {
          id: existingBookmark.id
        }
      })
      revalidatePath("/my-space");
      revalidatePath(`/my-space/post/${postId}`);

      return {
        success: true,
        bookmarked: false,
      };
    };


    await prisma.postBookmark.create({
      data: {
        userId: user.id,
        postId,
      }
    })

    revalidatePath("/my-space");
    revalidatePath(`/my-space/post/${postId}`);

    return {
      success: true,
      bookmarked: true,
    };

  } catch (error) {
    console.error("TOGGLE_BOOKMARK_ERROR", error);

    return {
      success: false,
      error: "Failed to toggle bookmark",
      bookmarked: false,
    };
  }
}

export async function toggleCommentBookmark(commentId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false,
        bookmarked: false,
        error: "Unauthorized",
      };
    }

    const comment = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        postId: true,
      },
    });

    if (!comment) {
      return {
        success: false,
        bookmarked: false,
        error: "Comment not found",
      };
    }

    const existingBookmark = await prisma.postBookmark.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      }
    });

    if (existingBookmark) {
      await prisma.postBookmark.delete({
        where: {
          id: existingBookmark.id
        }
      })

      revalidatePath("/my-space");
      revalidatePath(`/my-space/post/${comment.postId}`);

      return {
        success: true,
        bookmarked: false,
      };
    };


    await prisma.postBookmark.create({
      data: {
        userId: user.id,
        commentId,
      }
    })

    revalidatePath("/my-space");
    revalidatePath(`/my-space/post/${comment.postId}`);

    return {
      success: true,
      bookmarked: true,
    };

  } catch (error) {
    console.error("TOGGLE_BOOKMARK_ERROR", error);

    return {
      success: false,
      error: "Failed to toggle bookmark",
      bookmarked: false,
    };
  }
}