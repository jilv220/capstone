import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('resource')
    .addColumn('name', 'text', (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable('resource_phone_number')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('phone_number', 'text', (col) => col.unique())
    .addColumn('description', 'text')
    .addColumn('resource_name', 'text', (col) =>
      col.references('resource.name').onDelete('cascade').notNull()
    )
    .execute();

  await db.schema
    .createTable('resource_article')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('content', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('resource_name', 'text', (col) =>
      col.references('resource.name').onDelete('cascade').notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('resource_article').execute();
  await db.schema.dropTable('resource_phone_number').execute();
  await db.schema.dropTable('resource').execute();
}
