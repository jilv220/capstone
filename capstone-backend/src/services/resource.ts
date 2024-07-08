import { NotFoundError } from '@/interfaces/error.ts';
import { ResourceRepository, type TResourceRepository } from '@/repos/resource.ts';

import * as R from 'remeda';

async function mapToObj(
  resourceName?: string,
  repository: TResourceRepository = ResourceRepository
) {
  const resources = await repository.findWithPhoneNumberAndArticles(resourceName);
  if (resources.length === 0) {
    throw new NotFoundError('Mental health resource not found');
  }

  const resourceNameInArgs = resourceName !== undefined;
  const phoneNumbers = R.pipe(
    resources,
    R.map((re) => ({
      id: re.phone_number_id,
      phone_number: re.phone_number,
      description: re.description,
      resource_name: resourceNameInArgs ? undefined : re.resource_name,
    }))
  );

  const articles = R.pipe(
    resources,
    R.map((re) => ({
      id: re.article_id,
      title: re.title,
      content: re.content,
      created_at: re.created_at,
      updated_at: re.updated_at,
      resource_name: resourceNameInArgs ? undefined : re.resource_name,
    }))
  );

  return {
    phoneNumbers,
    articles,
  };
}

const ResourceService = {
  mapToObj,
};

export { ResourceService };
