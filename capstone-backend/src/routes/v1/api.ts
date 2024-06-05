import debug from 'debug';

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import signIn from './sign-in.ts';

const api = new Hono().basePath('/api/v1');
const Debug = debug('app:api');

api.use('/*', logger(Debug));
api.route('/', signIn);

export default api;
