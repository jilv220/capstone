import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE TYPE category AS ENUM 
    (
      'emotions',
      'productivity', 
      'school', 
      'weather',
      'social',
      'food',
      'sleep',
      'hobbies',
      'health',
      'chores',
      'romance',
      'beauty',
      'places',
      'period_symptoms',
      'bad_habits',
      'work'
    )
  `.execute(db);

  await db.schema
    .createTable('scenario')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('category', sql`category`)
    .addColumn('detail', 'text', (col) => col.unique().notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('scenario').execute();

  await sql`
    DROP TYPE category
  `.execute(db);
}
