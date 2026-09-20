import { expect, test } from "@playwright/test";

test("an unknown URL shows the 404 page and links back home", async ({
  page,
}) => {
  await page.goto("/this-page-does-not-exist");

  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Go home" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "MERN starter" }),
  ).toBeVisible();
});
