import { db } from '@/db/db.ts';

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
}
