import api from './routes/v1/api.ts';

import { swaggerUI } from '@hono/swagger-ui';
import { captureException } from '@sentry/bun';
import { type Env, Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { MeiliSearch } from 'meilisearch';
import { Conf } from './config.ts';
import { RESOURCE_ARTICLE_INDEX } from './interfaces/base.ts';
import { ResourceArticleRepository } from './repos/resourceArticle.ts';

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

// Init MeiliSearch
export const meili = new MeiliSearch({
  host: Conf.MEILI_HOST_URL,
  apiKey: Conf.MEILI_ADMIN_API_KEY,
});

const indexRes = await meili.getIndexes();
const hasNoIndex = indexRes.results.length === 0;
if (hasNoIndex) {
  await meili.createIndex(RESOURCE_ARTICLE_INDEX);
}
const articles = await ResourceArticleRepository.find();
meili
  .index(RESOURCE_ARTICLE_INDEX)
  .addDocuments(articles)
  .catch((e) => {
    captureException(e);
  });

export default app;
