import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("a user can sign up, use the protected API, and sign out", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();
  await page.getByLabel("Name").fill("Test Student");
  await page.getByLabel("Email").fill(`student-${randomUUID()}@example.com`);
  await page.getByLabel("Password").fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByRole("heading", { name: "Welcome, Test Student" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Test protected API" }).click();
  await expect(
    page.getByText("Protected API says hello to Test Student."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
