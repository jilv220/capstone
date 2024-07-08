import { meili } from '@/app.ts';
import { RESOURCE_ARTICLE_INDEX } from '@/interfaces/base.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const search = new Hono().basePath('/search');

search.get(
  '/',
  zValidator(
    'query',
    z.object({
      q: z.string().max(60).default(''),
      limit: z.coerce.number().max(40).default(20),
      offset: z.coerce.number().max(40).default(0),
    })
  ),
  async (c) => {
    const { q, limit, offset } = c.req.valid('query');
    const res = await meili.index(RESOURCE_ARTICLE_INDEX).search(q, {
      offset,
      limit,
    });
    return c.json(res);
  }
);

export default search;
