import debug from 'debug';

import { Conf } from '@/config.ts';
import { AuthService } from '@/services/auth.ts';
import { serverError } from '@/utils/hono.ts';
import { zValidator } from '@hono/zod-validator';
import { generateState } from 'arctic';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import type { Session } from 'lucia';
import {
  loginJsonSchema,
  loginParamSchema,
  loginParamTestSchema,
  loginRedirectSchema,
} from '../../schemas/login.ts';

const signIn = new Hono().basePath('/sign-in');
const Debug = debug('app:api:sign-in');

signIn.get(
  ':provider',
  zValidator('param', loginParamSchema),
  zValidator('query', loginRedirectSchema),
  async (c) => {
    const provider = c.req.valid('param').provider;
    const state = generateState();
    const auth = new AuthService();

    const redirect = c.req.valid('query').redirect;
    setCookie(c, 'redirect', redirect, {
      httpOnly: true,
      maxAge: 60 * 10,
      path: '/',
      secure: Conf.isProduction,
    });

    switch (provider) {
      case 'github': {
        const url = await auth.github.createAuthorizationURL(state, {
          scopes: ['read:user', 'user:email'],
        });
        setCookie(c, 'github_oauth_state', state, {
          httpOnly: true,
          maxAge: 60 * 10,
          path: '/',
          secure: Conf.isProduction,
        });

        return c.redirect(url.toString());
      }
      default:
        break;
    }

    return c.json({}, 400);
  }
);

signIn.get(
  ':provider/callback',
  zValidator('param', Conf.isProduction ? loginParamSchema : loginParamTestSchema),
  async (c) => {
    const provider = c.req.valid('param').provider;
    const auth = new AuthService();

    const url = new URL(c.req.url);
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    const redirect = getCookie(c, 'redirect');
    const stateCookie = getCookie(c, `${provider}_oauth_state`);

    const isInvalidRequest = !state || !stateCookie || !code || stateCookie !== state || !redirect;
    switch (provider) {
      case 'github': {
        if (isInvalidRequest) {
          return c.json({ error: 'Invalid request' }, 400);
        }

        const session = await auth.createGithubSession(code);
        if (!session) {
          return c.json({}, 400);
        }

        const redirectUrl = new URL(redirect);
        redirectUrl.searchParams.append('token', session.id);

        return c.redirect(redirectUrl.toString());
      }
      case 'test': {
        const session = await auth.createTestUserSession();
        if (!session) {
          return c.json({}, 400);
        }

        const redirectUrl = new URL(`http://localhost:${Conf.PORT}`);
        redirectUrl.searchParams.append('token', session.id);
        return c.redirect(redirectUrl.toString());
      }
      default:
        break;
    }

    return serverError(c);
  }
);

signIn.post(
  ':provider',
  zValidator('param', loginParamSchema),
  zValidator('json', loginJsonSchema),
  async (c) => {
    const auth = new AuthService();
    const provider = c.req.param('provider');
    const idToken = c.req.valid('json').idToken;

    let session: Session | null = null;
    switch (provider) {
      case 'google':
        session = await auth.createGoogleSession(idToken, '');
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
