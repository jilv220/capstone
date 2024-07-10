import { createRepository } from '@/utils/repo.ts';

const ResourceArticleRepository = {
  ...createRepository('resource_article'),
};
type TResourceArticleRepository = typeof ResourceArticleRepository;

export { ResourceArticleRepository, type TResourceArticleRepository };
