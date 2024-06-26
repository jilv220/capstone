import debug from 'debug';

import { Hono } from 'hono';
import { logger } from 'hono/logger';

import scenario from './scenario.ts';
import signIn from './sign-in.ts';
import signOut from './sign-out.ts';
import user from './user/index.ts';

const api = new Hono().basePath('/api/v1');
const Debug = debug('app:api');

api.use('/*', logger(Debug));
api.route('/', signIn);
api.route('/', signOut);
api.route('/', user);
api.route('/', scenario);

export default api;
