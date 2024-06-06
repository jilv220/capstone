import { Env, Hono } from 'hono';
import { cors } from 'hono/cors';
import api from './routes/v1/api.ts';
import { captureException } from '@sentry/node';

const app = new Hono<Env>();
app.use('*', cors({ origin: '*' }));

// Routes
app.get('/', (c) => {
  return c.html('This api is up and running.');
});
app.route('/', api);

// Monitor errors
app.onError((err, c) => {
  captureException(err);
  return c.text('Internal Server Error', 500);
});

export default app;
