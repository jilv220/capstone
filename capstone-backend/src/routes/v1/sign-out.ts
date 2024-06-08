import { lucia } from '@/db/lucia.ts';
import { Hono } from 'hono';

import debug from 'debug';

const signOut = new Hono().basePath('/sign-out');
const Debug = debug('app:api:sign-out');

signOut.post('/', async (c) => {
  const authorizationHeader = c.req.header('Authorization');
  const bearerSessionId = lucia.readBearerToken(authorizationHeader ?? '');

  const sessionId = bearerSessionId;
  if (!sessionId) {
    return c.json({ error: 'Not logged in' }, 400);
  }

  await lucia.invalidateSession(sessionId);
  return c.json(null, 200);
});

export default signOut;
