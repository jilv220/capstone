import { ResourceArticleRepo } from '@/repos/resourceArticle.ts';
import { Hono } from 'hono';
import search from './search.ts';

const article = new Hono().basePath('/article');
article.route('/', search);

article.get('/', async (c) => {
  const res = await ResourceArticleRepo.findAll();
  return c.json(res);
});

export default article;
