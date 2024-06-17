import authMiddleware, { type AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { Hono } from 'hono';

import debug from 'debug';
import moodLogStreak from './mood-log-streak.ts';
import moodLog from './mood-log.ts';

const user = new Hono<AuthMiddlewareEnv>().basePath('/user');
const Debug = debug('app:api:user');

/**
 * We are not social media or blogging app?
 * Every access to user resource should be from user themselves?
 */
user.use('*', authMiddleware);
user.route('/', moodLog);
user.route('/', moodLogStreak);

user.get('/me', async (c) => {
  const user = c.var.user;
  return c.json(user);
});

export default user;
