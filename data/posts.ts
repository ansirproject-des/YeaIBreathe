export type PostType = "reflection" | "practice" | "tip";

export type Post = {
  type: PostType;
  defaultValue: string;
};

export const posts: Record<PostType, Post> = {
  reflection: {
    type: "reflection",
    defaultValue: "",
  },

  practice: {
    type: "practice",
    defaultValue: "10 min",
  },

  tip: {
    type: "tip",
    defaultValue: "Productivity",
  },
};