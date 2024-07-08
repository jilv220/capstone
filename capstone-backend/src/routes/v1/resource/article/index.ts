import { Hono } from 'hono';
import search from './search.ts';

const article = new Hono().basePath('/article');
article.route('/', search);

export default article;
