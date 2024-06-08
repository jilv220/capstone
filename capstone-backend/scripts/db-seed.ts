import { Conf } from '@/config.ts';
import { Kysely, PostgresDialect, sql } from 'kysely';
import type { DB } from 'kysely-codegen';
import { generateId, generateIdFromEntropySize } from 'lucia';
import { Pool } from 'pg';

function makeId() {
  return generateIdFromEntropySize(10);
}

async function seed(db: Kysely<DB>): Promise<void> {
  // seed inital scenario details
  await db
    .insertInto('scenario')
    .values([
      /**Emotions */
      { id: makeId(), category: 'emotions', detail: 'happy' },
      { id: makeId(), category: 'emotions', detail: 'excited' },
      { id: makeId(), category: 'emotions', detail: 'grateful' },
      { id: makeId(), category: 'emotions', detail: 'relaxed' },
      { id: makeId(), category: 'emotions', detail: 'content' },
      { id: makeId(), category: 'emotions', detail: 'tired' },
      { id: makeId(), category: 'emotions', detail: 'unsure' },
      { id: makeId(), category: 'emotions', detail: 'bored' },
      { id: makeId(), category: 'emotions', detail: 'anxious' },
      { id: makeId(), category: 'emotions', detail: 'angry' },
      { id: makeId(), category: 'emotions', detail: 'stressed' },
      { id: makeId(), category: 'emotions', detail: 'sad' },
      { id: makeId(), category: 'emotions', detail: 'desperate' },

      /**Productivity */
      { id: makeId(), category: 'productivity', detail: 'start early' },
      { id: makeId(), category: 'productivity', detail: 'make list' },
      { id: makeId(), category: 'productivity', detail: 'focus' },
      { id: makeId(), category: 'productivity', detail: 'take a break' },

      /**School */
      { id: makeId(), category: 'school', detail: 'class' },
      { id: makeId(), category: 'school', detail: 'study' },
      { id: makeId(), category: 'school', detail: 'homework' },
      { id: makeId(), category: 'school', detail: 'exam' },
      { id: makeId(), category: 'school', detail: 'group project' },

      /**Weather */
      { id: makeId(), category: 'weather', detail: 'sunny' },
      { id: makeId(), category: 'weather', detail: 'clouds' },
      { id: makeId(), category: 'weather', detail: 'rain' },
      { id: makeId(), category: 'weather', detail: 'snow' },
      { id: makeId(), category: 'weather', detail: 'heat' },
      { id: makeId(), category: 'weather', detail: 'storm' },
      { id: makeId(), category: 'weather', detail: 'wind' },
    ])
    .execute();
}

async function main() {
  const pool = new Pool({ connectionString: Conf.DATABASE_URL });
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  try {
    await seed(db);
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await db.destroy();
  }
}

main();
