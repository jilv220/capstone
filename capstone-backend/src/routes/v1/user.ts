import authMiddleware, { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import debug from 'debug';
import { Hono } from 'hono';

const user = new Hono<AuthMiddlewareEnv>().basePath('/user');
const Debug = debug('app:api:user');

/**
 * We are not social media or blogging app?
 * Every access to user resource should be from user themselves?
 */
user.use('*', authMiddleware);

user.get('/me', async (c) => {
  const user = c.var.user;
  return c.json(user);
});

export default user;
