import api from './routes/v1/api.ts';

import { swaggerUI } from '@hono/swagger-ui';
import { captureException } from '@sentry/bun';
import { type Env, Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { Conf } from './config.ts';

const app = new Hono<Env>();
app.use('*', cors({ origin: '*' }));

// Routes
app.get('/', (c) => {
  return c.html('This api is up and running.');
});
app.route('/', api);

app.use(
  '/static/*',
  serveStatic({
    root: './',
  })
);

// Swagger
app.get('/ui', swaggerUI({ url: '/static/doc.yml' }));

// Monitor errors
app.onError((err, c) => {
  // Only report to sentry if prod or staging
  if (Conf.isProduction || Conf.isStaging) {
    captureException(err);
  } else {
    console.error(err);
  }
  return c.text('Internal Server Error', 500);
});

export default app;
