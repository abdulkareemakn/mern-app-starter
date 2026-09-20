import type { RequestHandler } from "express";
import * as z from "zod";

const targets = ["body", "params", "query"] as const;

type Target = (typeof targets)[number];
export type ValidationSchemas = Partial<Record<Target, z.ZodType>>;
export type ValidatedData<S extends ValidationSchemas> = {
  [K in keyof S]: S[K] extends z.ZodType ? z.output<S[K]> : never;
};
export type ValidatedLocals<S extends ValidationSchemas> = {
  validated: ValidatedData<S>;
};

export function validate<S extends ValidationSchemas>(
  schemas: S,
): RequestHandler<never, unknown, unknown, unknown, ValidatedLocals<S>> {
  return (req, res, next) => {
    const validated: Partial<Record<Target, unknown>> = {};

    for (const target of targets) {
      const schema = schemas[target];
      if (!schema) continue;

      const result = schema.safeParse(req[target]);
      if (!result.success) {
        res.status(400).json({
          error: `Invalid request ${target}`,
          details: z.flattenError(result.error),
        });
        return;
      }
      validated[target] = result.data;
    }

    res.locals.validated = validated as ValidatedData<S>;
    next();
  };
}
