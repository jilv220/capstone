import authMiddleware, { type AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { Hono } from 'hono';

import debug from 'debug';
import conversation from './conversation.ts';
import moodLog from './mood-log/index.ts';

const user = new Hono<AuthMiddlewareEnv>().basePath('/user');
const Debug = debug('app:api:user');

/**
 * We are not social media or blogging app?
 * Every access to user resource should be from user themselves?
 */
user.use('*', authMiddleware);
user.route('/', moodLog);
user.route('/', conversation);

user.get('/me', async (c) => {
  const user = c.var.user;
  return c.json(user);
});

export default user;
