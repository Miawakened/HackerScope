
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import bookmarksReducer from "../lib/features/bookmarks/bookmarksSlice";
import StoryBookmarkButton from "./StoryBookmarkButton";

describe("StoryBookmarkButton", () => {
  it("saves and removes a story when clicked", async () => {
    const story = { id: 123, title: "Test story" };
    const store = configureStore({
      reducer: { bookmarks: bookmarksReducer },
    });

    render(
      <Provider store={store}>
        <StoryBookmarkButton story={story} />
      </Provider>
    );

    const bookmarkButton = await screen.findByRole("button", {
      name: "Bookmark Test story",
    });

    fireEvent.click(bookmarkButton);

    const savedButton = await screen.findByRole("button", {
      name: "Remove Test story from bookmarks",
    });

    expect(savedButton).toHaveAttribute("aria-pressed", "true");
    expect(store.getState().bookmarks.items).toEqual([story]);

    fireEvent.click(savedButton);

    const removedButton = await screen.findByRole("button", {
      name: "Bookmark Test story",
    });

    expect(removedButton).toHaveAttribute("aria-pressed", "false");
    expect(store.getState().bookmarks.items).toEqual([]);
  });
});