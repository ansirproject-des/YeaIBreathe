"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type ReplyTarget = {
  id: string,
  username: string,
  authorType: "public" | "anonymous",
};

type CommentsContextType = {
  replyTarget: ReplyTarget | null;
  setReplyTarget: (target: ReplyTarget | null) => void;
};

const CommentsContext =
  createContext<CommentsContextType | null>(null);


export function CommentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [replyTarget, setReplyTarget] =
    useState<ReplyTarget | null>(null);

  return (
    <CommentsContext.Provider
      value={{
        replyTarget,
        setReplyTarget,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}


export function useComments() {
  const context = useContext(CommentsContext);

  if (!context) {
    throw new Error(
      "useComments must be used inside CommentsProvider"
    );
  }

  return context;
}