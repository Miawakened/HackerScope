
import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./features/feed/feedSlice";
import bookmarksReducer from "./features/bookmarks/bookmarksSlice";
import historyReducer from "./features/history/historySlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer,
      bookmarks: bookmarksReducer,
      history: historyReducer,

    },
  });