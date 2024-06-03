import { db } from '@/db/db.ts';
import { Insertable } from 'kysely';
import { OuathAccount, User } from 'kysely-codegen';

export class UserRepository {
  static async findOAuthAccount(provider_user_id: string) {
    return await db
      .selectFrom('ouath_account')
      .selectAll()
      .where('provider_user_id', '=', provider_user_id)
      .executeTakeFirst();
  }

  static async findByEmail(email: string) {
    return await db
      .selectFrom('user')
      .selectAll()
      .where('user.email', '=', email)
      .executeTakeFirst();
  }

  static async createWithOAuth(user: Insertable<User>, oauthAccount: Insertable<OuathAccount>) {
    await db.transaction().execute(async (tx) => {
      await tx.insertInto('user').values(user).returningAll().executeTakeFirstOrThrow();
      return await tx.insertInto('ouath_account').values(oauthAccount).execute();
    });
  }
}
