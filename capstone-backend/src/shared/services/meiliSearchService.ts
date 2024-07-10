import { meili } from '@/app.ts';
import { RESOURCE_ARTICLE_INDEX } from '@/interfaces/base.ts';
import type { Selectable } from 'kysely';
import type { ResourceArticle } from 'kysely-codegen';

async function addDocuments(articles: Selectable<ResourceArticle>[]) {
  return await meili.index(RESOURCE_ARTICLE_INDEX).addDocuments(articles);
}

const MeiliSearchService = {
  addDocuments,
};

export { MeiliSearchService };
