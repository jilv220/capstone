import { Conf } from '@/config.ts';
import { type Insertable, Kysely, PostgresDialect, sql } from 'kysely';
import type { DB, Scenario } from 'kysely-codegen';
import { Pool } from 'pg';

async function seed(db: Kysely<DB>): Promise<void> {
  const scenarioSeedData: Insertable<Scenario>[] = [
    /**Emotions */
    { category: 'emotions', detail: 'happy' },
    { category: 'emotions', detail: 'excited' },
    { category: 'emotions', detail: 'grateful' },
    { category: 'emotions', detail: 'relaxed' },
    { category: 'emotions', detail: 'content' },
    { category: 'emotions', detail: 'tired' },
    { category: 'emotions', detail: 'unsure' },
    { category: 'emotions', detail: 'bored' },
    { category: 'emotions', detail: 'anxious' },
    { category: 'emotions', detail: 'angry' },
    { category: 'emotions', detail: 'stressed' },
    { category: 'emotions', detail: 'sad' },
    { category: 'emotions', detail: 'desperate' },

    /**Productivity */
    { category: 'productivity', detail: 'start early' },
    { category: 'productivity', detail: 'make list' },
    { category: 'productivity', detail: 'focus' },
    { category: 'productivity', detail: 'take a break' },

    /**School */
    { category: 'school', detail: 'class' },
    { category: 'school', detail: 'study' },
    { category: 'school', detail: 'homework' },
    { category: 'school', detail: 'exam' },
    { category: 'school', detail: 'group project' },

    /**Weather */
    { category: 'weather', detail: 'sunny' },
    { category: 'weather', detail: 'clouds' },
    { category: 'weather', detail: 'rain' },
    { category: 'weather', detail: 'snow' },
    { category: 'weather', detail: 'heat' },
    { category: 'weather', detail: 'storm' },
    { category: 'weather', detail: 'wind' },

    /**Social */
    { category: 'social', detail: 'family' },
    { category: 'social', detail: 'friends' },
    { category: 'social', detail: 'party' },
    { category: 'social', detail: 'alone' },

    /**Food */
    { category: 'food', detail: 'eat healthy' },
    { category: 'food', detail: 'fast food' },
    { category: 'food', detail: 'homemade' },
    { category: 'food', detail: 'restaurant' },
    { category: 'food', detail: 'delivery' },
    { category: 'food', detail: 'no meat' },
    { category: 'food', detail: 'no sweets' },
    { category: 'food', detail: 'no soda' },

    /**Sleep */
    { category: 'sleep', detail: 'sleep early' },
    { category: 'sleep', detail: 'good sleep' },
    { category: 'sleep', detail: 'medium sleep' },
    { category: 'sleep', detail: 'bad sleep' },

    /**Hobbies */
    { category: 'hobbies', detail: 'movies & tv' },
    { category: 'hobbies', detail: 'reading' },
    { category: 'hobbies', detail: 'gaming' },
    { category: 'hobbies', detail: 'sport' },
    { category: 'hobbies', detail: 'relax' },

    /**Health */
    { category: 'health', detail: 'exercises' },
    { category: 'health', detail: 'eat healthy' },
    { category: 'health', detail: 'drink water' },
    { category: 'health', detail: 'walk' },

    /**Chores */
    { category: 'chores', detail: 'shopping' },
    { category: 'chores', detail: 'cleaning' },
    { category: 'chores', detail: 'cooking' },
    { category: 'chores', detail: 'laundry' },

    /**Romance */
    { category: 'romance', detail: 'give gift' },
    { category: 'romance', detail: 'flowers' },
    { category: 'romance', detail: 'appreciate' },
    { category: 'romance', detail: 'time together' },
    { category: 'romance', detail: 'date' },

    /**Beauty */
    { category: 'beauty', detail: 'haircut' },
    { category: 'beauty', detail: 'wellness' },
    { category: 'beauty', detail: 'massage' },
    { category: 'beauty', detail: 'manicure' },
    { category: 'beauty', detail: 'pedicure' },
    { category: 'beauty', detail: 'skin care' },
    { category: 'beauty', detail: 'spa' },

    /**Places */
    { category: 'places', detail: 'home' },
    { category: 'places', detail: 'work' },
    { category: 'places', detail: 'school' },
    { category: 'places', detail: 'visit' },
    { category: 'places', detail: 'travel' },
    { category: 'places', detail: 'gym' },
    { category: 'places', detail: 'cinema' },
    { category: 'places', detail: 'nature' },
    { category: 'places', detail: 'vacation' },

    /**Period Symptoms*/
    { category: 'period_symptoms', detail: 'cramps' },
    { category: 'period_symptoms', detail: 'headache' },
    { category: 'period_symptoms', detail: 'ovulation' },
    { category: 'period_symptoms', detail: 'tender breasts' },
    { category: 'period_symptoms', detail: 'back pain' },
    { category: 'period_symptoms', detail: 'dizziness' },
    { category: 'period_symptoms', detail: 'nausea' },
    { category: 'period_symptoms', detail: 'hot flashes' },
    { category: 'period_symptoms', detail: 'incontinence' },
    { category: 'period_symptoms', detail: 'mood swings' },
    { category: 'period_symptoms', detail: 'aggression' },

    /**Bad Habits */
    { category: 'bad_habits', detail: 'alcohol' },
    { category: 'bad_habits', detail: 'smoking' },
    { category: 'bad_habits', detail: 'snacking' },
    { category: 'bad_habits', detail: 'nail biting' },
    { category: 'bad_habits', detail: 'procrastinating' },

    /**Work */
    { category: 'work', detail: 'end on time' },
    { category: 'work', detail: 'overtime' },
    { category: 'work', detail: 'time building' },
    { category: 'work', detail: 'business trip' },
    { category: 'work', detail: 'sick day' },
    { category: 'work', detail: 'vacation' },
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
