import { Conf } from '@/config.ts';
import { type Insertable, Kysely, PostgresDialect, sql } from 'kysely';
import type { DB, Scenario } from 'kysely-codegen';
import { Pool } from 'pg';

async function seed(db: Kysely<DB>): Promise<void> {
  const scenarioSeedData: Insertable<Scenario>[] = [
    {
      name: 'bad_habits',
    },
    { name: 'beauty' },
    { name: 'chores' },
    { name: 'food' },
    { name: 'health' },
    { name: 'hobbies' },
    { name: 'period_symptoms' },
    { name: 'places' },
    { name: 'productivity' },
    { name: 'romance' },
    { name: 'school' },
    { name: 'sleep' },
    { name: 'social' },
    { name: 'weather' },
    { name: 'work' },
  ];

  for (const data of scenarioSeedData) {
    await db
      .insertInto('scenario')
      .values(data)
      .onConflict((oc) => oc.column('id').doUpdateSet(data))
      .execute();
  }
}

async function main() {
  const pool = new Pool({ connectionString: Conf.DATABASE_URL });
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  try {
    console.log('seeding database...');
    await seed(db);
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await db.destroy();
  }
}

main();
