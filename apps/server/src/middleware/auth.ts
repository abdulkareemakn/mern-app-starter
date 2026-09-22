import type { ApiError } from "@mern/shared";
import { fromNodeHeaders } from "better-auth/node";
import type { RequestHandler } from "express";
import type { createAuth } from "#/auth";

export type AuthenticatedLocals = {
  session: NonNullable<
    Awaited<ReturnType<ReturnType<typeof createAuth>["api"]["getSession"]>>
  >;
};

export function authMiddleware(
  auth: ReturnType<typeof createAuth>,
): RequestHandler<never, unknown, never, never, AuthenticatedLocals> {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Sign in to continue" } satisfies ApiError);
      return;
    }
    res.locals.session = session;
    next();
  };
}
