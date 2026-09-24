import { expect, test } from "@playwright/test";

test("introduces the course starter", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Learn by building the whole thing." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What it contains" }),
  ).toBeVisible();
  await expect(page.getByText("React, Vite, TanStack Router")).toBeVisible();
  await expect(page.getByText("Express, TypeScript, Zod")).toBeVisible();
  await expect(page.getByText("MongoDB, Mongoose")).toBeVisible();
});
