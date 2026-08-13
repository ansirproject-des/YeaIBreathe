import axios from "axios";
import { type DbSession } from "@/lib/session/sessions";


export async function getSessions() {
  const res = await axios.get<DbSession[]>("/api/sessions");
  return res.data;
}

export async function getUnfinishedSession() {
  const res = await axios.get<DbSession | null>("/api/sessions/unfinished")
  return res.data;
}

export async function getSession(sessionId: string) {
  const res = await axios.get<DbSession>(`/api/sessions/${sessionId}`)
  return res.data;
}
