import debug from 'debug';

import { zValidator } from '@hono/zod-validator';
import { loginJsonSchema, loginParamSchema } from '../../schemas/login.ts';
import { Session } from 'lucia';
import { Hono } from 'hono';
import { generateState } from 'arctic';
import { AuthService } from '@/services/auth.ts';
import { getCookie, setCookie } from 'hono/cookie';
import { Conf } from '@/config.ts';

const signIn = new Hono().basePath('/sign-in');
const Debug = debug('app:api:sign-in');

signIn.get(':provider', zValidator('param', loginParamSchema), async (c) => {
  const provider = c.req.valid('param').provider;
  const state = generateState();
  const auth = new AuthService();

  switch (provider) {
    case 'github': {
      const url = await auth.github.createAuthorizationURL(state);
      setCookie(c, 'github_oauth_state', state, {
        httpOnly: true,
        maxAge: 60 * 10,
        path: '/',
        secure: Conf.envType === 'production',
      });
      return c.redirect(url.toString());
    }
    default:
      break;
  }

  return c.json({}, 400);
});

signIn.get(':provider/callback', zValidator('param', loginParamSchema), async (c) => {
  const provider = c.req.valid('param').provider;

  const url = new URL(c.req.url);
  let state = url.searchParams.get('state');
  let code = url.searchParams.get('code');
  let stateCookie = getCookie(c, `${provider}_oauth_state`);

  if (!state || !stateCookie || !code || stateCookie !== state) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  switch (provider) {
    case 'github': {
    }
    default:
      break;
  }
});

signIn.post(
  ':provider',
  zValidator('param', loginParamSchema),
  zValidator('json', loginJsonSchema),
  async (c) => {
    const auth = new AuthService();
    const provider = c.req.param('provider');
    const idToken = c.req.valid('json').idToken;
    const sessionToken = c.req.valid('json').sessionToken;

    let session: Session | null = null;
    switch (provider) {
      case 'google':
        session = await auth.createGoogleSession({
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
