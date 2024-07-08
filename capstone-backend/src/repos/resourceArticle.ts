import { createOne, findAll, findBy } from '@/utils/repo.ts';

const ResourceArticleRepo = {
  findAll: findAll('resource_article'),
  findBy: findBy.bind(null, 'resource_article'),
  createOne: createOne('resource_article'),
};
type TResourceArticleRepo = typeof ResourceArticleRepo;

export { ResourceArticleRepo, type TResourceArticleRepo };
