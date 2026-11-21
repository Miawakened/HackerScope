
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeCategory: "top",
  searchQuery: "",
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearSearch(state) {
      state.searchQuery = "";
    },
  },
});

export const { setActiveCategory, setSearchQuery, clearSearch } =
  feedSlice.actions;

export const selectActiveCategory = (state) => state.feed.activeCategory;
export const selectSearchQuery = (state) => state.feed.searchQuery;

export default feedSlice.reducer;