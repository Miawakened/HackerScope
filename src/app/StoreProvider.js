"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import { setBookmarks } from "../lib/features/bookmarks/bookmarksSlice";
import { setHistory } from "../lib/features/history/historySlice";

const BOOKMARKS_STORAGE_KEY = "hackerscope-bookmarks";
const HISTORY_STORAGE_KEY = "hackerscope-history";

export default function StoreProvider({ children }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    try {
      const savedBookmarks = window.localStorage.getItem(
        BOOKMARKS_STORAGE_KEY
      );

      if (savedBookmarks) {
        const parsedBookmarks = JSON.parse(savedBookmarks);

        if (Array.isArray(parsedBookmarks)) {
          store.dispatch(setBookmarks(parsedBookmarks));
        }
      }
    } catch (error) {
      console.error("Could not load saved bookmarks.", error);
    }

    let historyToLoad = [];

    try {
      const savedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);

        if (Array.isArray(parsedHistory)) {
          historyToLoad = parsedHistory;
        }
      }
    } catch (error) {
      console.error("Could not load reading history.", error);
    }

    store.dispatch(setHistory(historyToLoad));

    let previousBookmarks = store.getState().bookmarks.items;
    let previousHistory = store.getState().history.items;

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const currentBookmarks = state.bookmarks.items;
      const currentHistory = state.history.items;

      if (currentBookmarks !== previousBookmarks) {
        previousBookmarks = currentBookmarks;

        try {
          window.localStorage.setItem(
            BOOKMARKS_STORAGE_KEY,
            JSON.stringify(currentBookmarks)
          );
        } catch (error) {
          console.error("Could not save bookmarks.", error);
        }
      }

      if (currentHistory !== previousHistory) {
        previousHistory = currentHistory;

        try {
          window.localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(currentHistory)
          );
        } catch (error) {
          console.error("Could not save reading history.", error);
        }
      }
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}