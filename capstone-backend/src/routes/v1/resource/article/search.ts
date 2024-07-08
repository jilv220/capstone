import { Hono } from 'hono';

const search = new Hono().basePath('/search');

search.get('/', (c) => {
  return c.text('this is a search endpoint');
});

export default search;
