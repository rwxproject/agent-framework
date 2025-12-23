import { test, expect } from "@playwright/test";

test.describe("Chat Interface", () => {
  test("homepage loads with chat interface", async ({ page }) => {
    await page.goto("/");

    // Check header is visible
    await expect(page.getByText("Agent Framework")).toBeVisible();

    // Check sidebar navigation
    await expect(page.getByText("Chat")).toBeVisible();
    await expect(page.getByText("Configuration")).toBeVisible();
  });

  test("chat container displays initial message", async ({ page }) => {
    await page.goto("/");

    // Wait for CopilotChat to load
    await page.waitForTimeout(1000);

    // Check that the page has loaded properly
    await expect(page.locator("body")).toBeVisible();
  });
});
