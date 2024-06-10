import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE TYPE mood AS ENUM 
    (
      'rad',
      'good',
      'meh',
      'bad',
      'awful' 
    )
  `.execute(db);

  await db.schema
    .createTable('mood_log')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('mood', sql`mood`, (col) => col.notNull())
    .addColumn('note', 'text')
    .addColumn('log_date', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('user_id', 'text', (col) => col.references('user.id').onDelete('cascade').notNull())
    .execute();

  await db.schema
    .createTable('mood_log_scenario')
    .addColumn('mood_log_id', 'text', (col) => col.references('mood_log.id').notNull())
    .addColumn('scenario_id', 'integer', (col) => col.references('scenario.id').notNull())
    .addPrimaryKeyConstraint('mood_log_scenario_pk', ['mood_log_id', 'scenario_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('mood_log_scenario').execute();
  await db.schema.dropTable('mood_log').execute();

  await sql`
    DROP TYPE mood
  `.execute(db);
}
