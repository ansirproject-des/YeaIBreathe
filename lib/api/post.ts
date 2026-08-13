import axios from "axios";
import { DbComment, SavedItem, type DbPost } from "../types";

export async function getPosts() {
  const res = await axios.get<DbPost[]>("/api/posts");
  return res.data;
}

export async function getPublicProfilePosts(userId: string) {
  const res = await axios.get<DbPost[]>(`/api/users/${userId}/posts`);
  return res.data;
}

export async function getReplies(commentId: string) {
  const res = await axios.get<DbComment[]>(
    `/api/comments/${commentId}/replies`
  );

  return res.data;
}

export async function getSavedItems() {
  const res = await axios.get<SavedItem[]>("/api/saved");
  return res.data;
}