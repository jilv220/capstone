import { z } from "zod";

export const loginParamSchema = z.object({
  provider: z.enum(["google", "github"]),
});

export const loginJsonSchema = z.object({
  idToken: z.string(),
  user: z
    .object({
      username: z.string(),
    })
    .optional(),
  sessionToken: z.string().optional(),
});