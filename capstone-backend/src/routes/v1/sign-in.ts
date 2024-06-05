import debug from 'debug';

import { zValidator } from '@hono/zod-validator';
import { loginJsonSchema, loginParamSchema } from '../../schemas/login.ts';
import { Session } from 'lucia';
import { createGoogleSession } from '@/lib/auth/google.ts';
import { Hono } from 'hono';

const signIn = new Hono().basePath('/sign-in');
const Debug = debug('app:api:login');

signIn.post(
  ':provider',
  zValidator('param', loginParamSchema),
  zValidator('json', loginJsonSchema),
  async (c) => {
    const provider = c.req.param('provider');
    const idToken = c.req.valid('json').idToken;
    const sessionToken = c.req.valid('json').sessionToken;

    let session: Session | null = null;
    switch (provider) {
      case 'google':
        session = await createGoogleSession({
          idToken,
          codeVerifier: '',
          sessionToken,
        });
        break;
      default:
        break;
    }

    if (!session) {
      return c.json({}, 400);
    }
    return c.json({ token: session.id });
  }
);

export default signIn;
