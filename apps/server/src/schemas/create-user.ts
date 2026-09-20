import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  age: z.number().int().min(13, "Age must be at least 13"),
});

export type CreateUser = z.infer<typeof createUserSchema>;
