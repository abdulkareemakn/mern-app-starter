import { fileURLToPath } from "node:url";
import type { ApiError, HealthResponse, MeResponse } from "@mern/shared";
import { toNodeHandler } from "better-auth/node";
import express, { type ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import type { createAuth } from "./auth.ts";
import type { Config } from "./config.ts";
import { authMiddleware } from "./middleware/auth.ts";

export function createApp(auth: ReturnType<typeof createAuth>, config: Config) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use((req, _res, next) => {
    // Overwrite client-supplied values; Express verifies the proxy chain first.
    req.headers["x-mern-client-ip"] = req.ip || req.socket.remoteAddress;
    next();
  });

  // Better Auth needs the untouched request body. Keep this before express.json().
  app.all("/api/auth/{*path}", toNodeHandler(auth));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res
      .status(ready ? 200 : 503)
      .json({ status: ready ? "ok" : "unavailable" } satisfies HealthResponse);
  });

  app.get("/api/me", authMiddleware(auth), (_req, res) => {
    const { session } = res.locals;
    const { id, name, email } = session.user;
    res.json({ user: { id, name, email } } satisfies MeResponse);
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API route not found" } satisfies ApiError);
  });

  if (config.nodeEnv === "production") {
    const clientDist = fileURLToPath(
      new URL("../../client/dist/", import.meta.url),
    );
    app.use(express.static(clientDist));
    app.get("/{*path}", (_req, res) =>
      res.sendFile("index.html", { root: clientDist }),
    );
  }

  const handleError: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) return next(error);
    const status =
      error?.status === 413 ? 413 : error?.status === 400 ? 400 : 500;
    // Do not log request bodies, cookies, database URLs, or raw dependency errors.
    if (status === 500) console.error("Request failed with an internal error");
    res.status(status).json({
      error:
        status === 413
          ? "Request body too large"
          : status === 400
            ? "Invalid request body"
            : "Internal server error",
    } satisfies ApiError);
  };
  app.use(handleError);
  return app;
}
