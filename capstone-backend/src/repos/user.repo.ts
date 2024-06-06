import { db } from '@/db/db.ts';
import type { Insertable } from 'kysely';
import type { OuathAccount, User } from 'kysely-codegen';

export const UserRepository = {
  async findOAuthAccount(provider_user_id: string) {
    return await db
      .selectFrom('ouath_account')
      .selectAll()
      .where('provider_user_id', '=', provider_user_id)
      .executeTakeFirst();
  },

  async findBy(uniqueFields: Partial<Pick<User, 'id' | 'email'>>) {
    let query = db.selectFrom('user').selectAll();

    if (uniqueFields.email) {
      query = query.where('email', '=', uniqueFields.email);
    }
    if (uniqueFields.id) {
      query = query.where('id', '=', uniqueFields.id);
    }

    return await query.executeTakeFirst();
  },

  async createOAuthAccount(oauthAccount: Insertable<OuathAccount>) {
    await db.insertInto('ouath_account').values(oauthAccount).execute();
  },

  async createWithOAuth(user: Insertable<User>, oauthAccount: Insertable<OuathAccount>) {
    await db.transaction().execute(async (tx) => {
      await tx.insertInto('user').values(user).returningAll().executeTakeFirstOrThrow();
      return await tx.insertInto('ouath_account').values(oauthAccount).execute();
    });
  },
};
