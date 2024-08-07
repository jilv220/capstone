import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const Env = createEnv({
  server: {
    PORT: z.coerce.number().max(65535).default(4036),
    NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
    HEALTH_LINK_SECRET: z.string(),
    DATABASE_URL: z.string().url().default('postgres://postgres:postgres@localhost:5432/postgres'),
    MEILI_HOST_URL: z.string(),
    MEILI_ADMIN_API_KEY: z.string(),
    NATIVE_APP_PACKAGE_NAME: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string().default(''),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    OPENAI_API_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

const Conf = {
  ...Env,
  get isProduction() {
    return Env.NODE_ENV === 'production';
  },
  get isStaging() {
    return Env.NODE_ENV === 'staging';
  },
  get expoRedirectURI() {
    return `${Env.NATIVE_APP_PACKAGE_NAME}://`;
  },
  get testUser() {
    return {
      email: 'test@mail.com',
      username: 'testuser',
      avatarUrl: '',
    };
  },
  get googleOAuth() {
    return {
      clientId: Env.GOOGLE_CLIENT_ID,
      clientSecret: Env.GOOGLE_CLIENT_SECRET,
      redirectURI: Env.GOOGLE_REDIRECT_URI,
    };
  },
  get githubOAuth() {
    return {
      clientId: Env.GITHUB_CLIENT_ID,
      clientSecret: Env.GITHUB_CLIENT_SECRET,
    };
  },
};

export { Conf };
