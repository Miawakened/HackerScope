
import { createSlice } from "@reduxjs/toolkit";

const MAX_HISTORY_ITEMS = 50;

const initialState = {
  items: [],
  isHydrated: false,

};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    recordVisit(state, action) {
      const visitedStory = action.payload;
      

      state.items = [
        visitedStory,
        ...state.items.filter(
          (item) => String(item.id) !== String(visitedStory.id)
        ),
      ].slice(0, MAX_HISTORY_ITEMS);
    },
    setHistory(state, action) {
      state.items = action.payload;
      state.isHydrated = true;
    },
    clearHistory(state) {
      state.items = [];
    },
  },
});

export const { recordVisit, setHistory, clearHistory } =
  historySlice.actions;

export const selectHistory = (state) => state.history.items;
export const selectHistoryHydrated = (state) => state.history.isHydrated;

export default historySlice.reducer;