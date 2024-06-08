import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('user')
    .addColumn('username', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('user').dropColumn('username').dropColumn('email').execute();
}
