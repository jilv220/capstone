import { db } from '@/db/db.ts';
import type { Insertable } from 'kysely';
import type { MoodLog, MoodLogScenario } from 'kysely-codegen';

async function insertOrUpdateMoodLog(
  moodLog: Insertable<MoodLog>,
  moodLogScenarios: Insertable<MoodLogScenario>[]
) {
  const { id, log_date, mood, note, user_id } = moodLog;

  return await db.transaction().execute(async (tx) => {
    const newMoodLog = await tx
      .insertInto('mood_log')
      .values({
        id,
        log_date,
        mood,
        note,
        user_id,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          log_date,
          mood,
          note,
          user_id,
          updated_at: new Date(),
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    /**
     * Delete all the old scenarios
     * Front-end needs to pass a full copy of modified scenarios
     */
    await tx.deleteFrom('mood_log_scenario').where('mood_log_id', '=', id).execute();
    await tx.insertInto('mood_log_scenario').values(moodLogScenarios).execute();
    return newMoodLog;
  });
}

const ScenarioRepository = {
  insertOrUpdateMoodLog,
};

export { ScenarioRepository };
