import { uuidv7 } from '@/utils/base.ts';
import type { z } from 'zod';
import type { articleCreateSchema } from './article.schema.ts';

import * as R from 'remeda';

type TArticleInsert = z.infer<typeof articleCreateSchema>;

const withId = (article: TArticleInsert) => R.addProp(article, 'id', uuidv7());
const withIds = (articles: TArticleInsert[]) => R.map(articles, withId);

export const ArticleDTO = {
  withId,
  withIds,
};
