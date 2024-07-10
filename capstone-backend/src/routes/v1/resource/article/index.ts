import { ArticleDTO } from '@/articles/article.dto.ts';
import { ResourceArticleRepository } from '@/articles/article.repo.ts';
import { articleBatchCreateSchema } from '@/articles/article.schema.ts';
import { MeiliSearchService } from '@/shared/services/meiliSearchService.ts';
import { serverError } from '@/utils/hono.ts';
import { zValidator } from '@hono/zod-validator';
import { captureException } from '@sentry/bun';
import { Hono } from 'hono';

import debug from 'debug';
import * as R from 'remeda';
import search from './search.ts';

const article = new Hono().basePath('/article');
const Debug = debug('app:api:resource:article');

article.route('/', search);

article.get('/', async (c) => {
  const res = await ResourceArticleRepository.find();
  return c.json(res);
});

article.post('/', zValidator('json', articleBatchCreateSchema), async (c) => {
  const articles = R.pipe(c.req.valid('json'), ArticleDTO.withIds);

  try {
    const res = await ResourceArticleRepository.insert(articles);

    // MeiliSearch has internal batching, I don't need to do it myself
    MeiliSearchService.addDocuments(res).catch((e) => {
      Debug(e);
      captureException(e);
    });

    return c.json([...res]);
  } catch (e) {
    return serverError(c);
  }
});

export default article;
