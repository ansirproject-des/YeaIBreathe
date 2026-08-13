import axios from "axios";
import { DbPost } from "../types";

export async function getFeed() {
  const res = await axios.get<DbPost[]>("/api/feed");
  return res.data;
}