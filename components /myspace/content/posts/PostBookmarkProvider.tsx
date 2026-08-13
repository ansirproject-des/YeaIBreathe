"use client";

import { createContext, useContext, useState } from "react";

type BookmarkContextValue = {
  bookmarked: boolean;
  bookmarks: number;
  setBookmarked: (value: boolean) => void;
  setBookmarks: React.Dispatch<React.SetStateAction<number>>;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({
  initialBookmarked,
  initialBookmarks,
  children,
}: {
  initialBookmarked: boolean;
  initialBookmarks: number;
  children: React.ReactNode;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarked,
        bookmarks,
        setBookmarked,
        setBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmark must be used inside BookmarkProvider");
  }

  return context;
}