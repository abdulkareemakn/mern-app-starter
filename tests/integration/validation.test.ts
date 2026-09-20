import express from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";
import * as z from "zod";
import { validate } from "../../apps/server/src/middleware/validate.ts";

function createValidationApp(onInvalid?: () => void) {
  const app = express();
  app.use(express.json());

  app.post(
    "/body",
    validate({
      body: z.object({
        name: z.string().trim().min(1),
        age: z.coerce.number().int().default(18),
      }),
    }),
    (_req, res) => res.json(res.locals.validated.body),
  );
  app.get(
    "/users/:id",
    validate({ params: z.object({ id: z.coerce.number().int().positive() }) }),
    (_req, res) => res.json({ id: res.locals.validated.params.id }),
  );
  app.get(
    "/search",
    validate({
      query: z.object({
        page: z.coerce.number().int().positive().default(1),
        term: z.string().trim(),
      }),
    }),
    (_req, res) => res.json(res.locals.validated.query),
  );
  app.patch(
    "/users/:id",
    validate({
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: z.object({ notify: z.coerce.boolean().default(false) }),
      body: z.object({ name: z.string().trim().min(1) }),
    }),
    (_req, res) => res.json(res.locals.validated),
  );
  app.post(
    "/never-reached",
    validate({ body: z.object({ name: z.string().min(1) }) }),
    (_req, res) => {
      onInvalid?.();
      res.sendStatus(204);
    },
  );

  return app;
}

describe("validate middleware", () => {
  test("passes parsed and normalized body data to the handler", async () => {
    const response = await request(createValidationApp())
      .post("/body")
      .send({ name: " Ada " });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "Ada", age: 18 });
  });

  test("returns structured Zod errors for an invalid body", async () => {
    const response = await request(createValidationApp())
      .post("/body")
      .send({ name: "", age: "nope" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request body");
    expect(Object.keys(response.body.details.fieldErrors)).toEqual([
      "name",
      "age",
    ]);
  });

  test("validates and exposes params", async () => {
    const response = await request(createValidationApp()).get("/users/42");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 42 });
  });

  test("validates and exposes query values", async () => {
    const response = await request(createValidationApp()).get(
      "/search?term=%20zod%20&page=2",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ term: "zod", page: 2 });
  });

  test("validates multiple request targets", async () => {
    const response = await request(createValidationApp())
      .patch("/users/42?notify=true")
      .send({ name: " Ada " });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      params: { id: 42 },
      query: { notify: true },
      body: { name: "Ada" },
    });
  });

  test("does not call the handler when validation fails", async () => {
    let reached = false;
    const response = await request(createValidationApp(() => (reached = true)))
      .post("/never-reached")
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(reached).toBe(false);
  });
});
