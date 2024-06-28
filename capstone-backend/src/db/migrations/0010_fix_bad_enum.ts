import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Rename old
  await sql`
    ALTER TYPE category RENAME TO category_old`.execute(db);

  // Update
  await sql`
    CREATE TYPE category AS ENUM 
    (
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

  /**
   * Suffering...
   * https://www.munderwood.ca/index.php/2015/05/28/altering-postgresql-columns-from-one-enum-to-another/
   */
  await db.schema
    .alterTable('scenario')
    .alterColumn('name', (col) => col.setDataType(sql`category USING name::text::category`))
    .execute();

  // Drop old
  await sql`DROP TYPE category_old`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TYPE category RENAME TO category_new`.execute(db);

  // Recreate old category type
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

  // Revert the column type
  await db.schema
    .alterTable('scenario')
    .alterColumn('name', (col) => col.setDataType(sql`category USING name::text::category`))
    .execute();

  // Drop the new category type
  await sql`DROP TYPE category_new`.execute(db);
}
