import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  /**
   * Don't do this in actual production code...
   * You should actually migrate user data first...
   */
  await db.deleteFrom('scenario').where('name', '=', 'emotions').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.insertInto('scenario').values({ name: 'emotions' }).execute();
}
