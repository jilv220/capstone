import { lucia } from '@/db/lucia.ts';
import { createMiddleware } from 'hono/factory';
import type { Session, User } from 'lucia';

export type AuthMiddlewareEnv = {
  Variables: {
    user: User;
    session: Session;
  };
};

const authMiddleware = createMiddleware<AuthMiddlewareEnv>(async (c, next) => {
  const authorizationHeader = c.req.header('Authorization');
  const bearerToken = lucia.readBearerToken(authorizationHeader ?? '');
  const sessionId = bearerToken;

  if (!sessionId) {
    return c.newResponse('Unauthorized', { status: 401 });
  }

  const { user, session } = await lucia.validateSession(sessionId);
  if (!session) {
    return c.newResponse('Unauthorized', { status: 401 });
  }

  if (session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header('Set-Cookie', sessionCookie.serialize());
  }

  c.set('user', user);
  c.set('session', session);
  await next();
});

export default authMiddleware;
