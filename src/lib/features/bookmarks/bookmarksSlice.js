
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    toggleBookmark(state, action) {
      const story = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => String(item.id) === String(story.id)
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(story);
      }
    },
    setBookmarks(state, action) {
      state.items = action.payload;
    },
  },
});

export const { toggleBookmark, setBookmarks } = bookmarksSlice.actions;
export const selectBookmarks = (state) => state.bookmarks.items;

export default bookmarksSlice.reducer;