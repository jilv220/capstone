import debug from 'debug';

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import signIn from './sign-in.ts';
import user from './user.ts';
import signOut from './sign-out.ts';

const api = new Hono().basePath('/api/v1');
const Debug = debug('app:api');

api.use('/*', logger(Debug));
api.route('/', signIn);
api.route('/', signOut);
api.route('/', user);

export default api;
