import { Conf } from '@/config.ts';
import { z } from 'zod';

export const loginParamSchema = z.object({
  provider: z.enum(['google', 'github']),
});
export type AuthProvider = z.infer<typeof loginParamSchema>['provider'];

export const loginParamTestSchema = loginParamSchema.extend({
  provider: z.enum(['google', 'github', 'test']),
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

export const loginRedirectSchema = z.object({
  redirect: z
    // TODO: Domain should be configuarble
    .enum([`${Conf.expoRedirectURI}`, `http://localhost:${Conf.PORT}`])
    .default(`http://localhost:${Conf.PORT}`),
});
