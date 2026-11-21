import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("sends the typed search text to its callback", () => {
    const onQueryChange = jest.fn();

    render(<SearchBar query="" onQueryChange={onQueryChange} />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "Search stories" }),
      { target: { value: "Next.js" } }
    );

    expect(onQueryChange).toHaveBeenCalledWith("Next.js");
  });

  it("clears the search when the clear button is clicked", () => {
    const onQueryChange = jest.fn();

    render(<SearchBar query="Next.js" onQueryChange={onQueryChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onQueryChange).toHaveBeenCalledWith("");
  });
});