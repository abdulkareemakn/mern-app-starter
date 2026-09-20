import type { ApiError } from "@mern/shared";
import type { RequestHandler } from "express";
import type { AuthenticatedLocals } from "./auth.ts";

export const adminMiddleware: RequestHandler<
  never,
  unknown,
  never,
  never,
  AuthenticatedLocals
> = (_req, res, next) => {
  if (!res.locals.session.user.role?.split(",").includes("admin")) {
    res.status(403).json({ error: "Admin access required" } satisfies ApiError);
    return;
  }
  next();
};
