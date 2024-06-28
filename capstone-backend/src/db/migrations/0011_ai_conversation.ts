import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('ai_conversation')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('title', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('user_id', 'text', (col) => col.references('user.id').onDelete('cascade').notNull())
    .execute();

  await db.schema
    .createTable('ai_chat')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('ai_conversation_id', 'text', (col) =>
      col.references('ai_conversation.id').onDelete('cascade').notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ai_chat').execute();
  await db.schema.dropTable('ai_conversation').execute();
}
