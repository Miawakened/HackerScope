import { test, expect } from "@playwright/test";

test("shows the not-found screen and returns to the feed", async ({ page }) => {
  await page.goto("/stories/not-a-real-story-id");

  await expect(
    page.getByRole("heading", { name: "Story not found" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Back to the feed" }).click();

  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByLabel("Search stories")).toBeVisible();
});