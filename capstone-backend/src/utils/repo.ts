import { db } from '@/db/db.ts';
import type { ExtractTableAlias } from '@/interfaces/repo.ts';
import type { InsertQueryBuilder, Insertable, Kysely, Transaction } from 'kysely';
import type { ReferenceExpression } from 'kysely';
import type { OperandValueExpressionOrList } from 'kysely';
import type { InsertObject } from 'kysely';
import type { DB } from 'kysely-codegen';

type TRepoFindByArg<T extends keyof DB> = {
  lhs: ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
  rhs: OperandValueExpressionOrList<DB, T, ReferenceExpression<DB, T>>;
  dbOrTrx?: Kysely<DB> | Transaction<DB>;
};

/**
 * Currying to make repository less verbose
 */
export function createOne<T extends keyof DB>(table: T) {
  return async (insertable: InsertObject<DB, T>, dbOrTrx: Kysely<DB> | Transaction<DB> = db) => {
    return await dbOrTrx.insertInto(table).values(insertable).returningAll().executeTakeFirst();
  };
}

export function findAll<T extends keyof DB>(table: T) {
  return async (dbOrTrx: Kysely<DB> | Transaction<DB> = db) => {
    return await dbOrTrx.selectFrom(table).selectAll().execute();
  };
}

export async function findBy<T extends keyof DB>(
  table: T,
  { lhs, rhs, dbOrTrx = db }: TRepoFindByArg<T>
) {
  return await dbOrTrx.selectFrom(table).selectAll().where(lhs, '=', rhs).execute();
}
