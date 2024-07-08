import { db } from '@/db/db.ts';
import { createOne, findBy } from '@/utils/repo.ts';
import type { Kysely, Transaction } from 'kysely';
import type { DB } from 'kysely-codegen';

async function findWithPhoneNumberAndArticles(
  resourceName?: string,
  dbOrTrx: Kysely<DB> | Transaction<DB> = db
) {
  let query = dbOrTrx
    .selectFrom('resource')
    .innerJoin('resource_article as ra', 'ra.resource_name', 'resource.name')
    .innerJoin('resource_phone_number as rpn', 'rpn.resource_name', 'resource.name')
    .select([
      'ra.resource_name',
      'rpn.id as phone_number_id',
      'rpn.phone_number',
      'rpn.description',
      'ra.id as article_id',
      'ra.title',
      'ra.content',
      'ra.created_at',
      'ra.updated_at',
    ]);

  if (resourceName !== undefined) {
    query = query.where('resource.name', '=', resourceName);
  }

  return await query.execute();
}

const ResourceRepository = {
  findBy: findBy.bind(null, 'resource'),
  createOne: createOne('resource'),
  findWithPhoneNumberAndArticles,
};
type TResourceRepository = typeof ResourceRepository;

export { ResourceRepository, type TResourceRepository };