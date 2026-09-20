import { describe, expect, test } from "vitest";
import { createUserSchema } from "../../apps/server/src/schemas/create-user.ts";

describe("createUserSchema", () => {
  test("parses and normalizes a valid user", () => {
    expect(
      createUserSchema.parse({
        name: " Ada ",
        email: "ada@example.com",
        age: 30,
      }),
    ).toEqual({ name: "Ada", email: "ada@example.com", age: 30 });
  });

  test("reports invalid fields", () => {
    const result = createUserSchema.safeParse({
      name: "",
      email: "not-an-email",
      age: 12,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        name: ["Name is required"],
        email: ["Enter a valid email address"],
        age: ["Age must be at least 13"],
      });
    }
  });
});
