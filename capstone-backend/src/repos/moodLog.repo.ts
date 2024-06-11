import { db } from '@/db/db.ts';
import type { MoodLogCreate, MoodLogUpdate } from '@/interfaces/moodLog.ts';
import type { Insertable, Updateable } from 'kysely';
import type { MoodLog, MoodLogScenario } from 'kysely-codegen';

async function findById(id: string) {
  return await db.selectFrom('mood_log').selectAll().where('id', '=', id).executeTakeFirst();
}

async function createWithScenario(
  moodLog: MoodLogCreate,
  moodLogScenarios: Insertable<MoodLogScenario>[]
) {
  const { id, log_date, mood, note, user_id } = moodLog;

  return await db.transaction().execute(async (tx) => {
    const insertMoodLog = await tx
      .insertInto('mood_log')
      .values({
        id,
        log_date,
        mood,
        note,
        user_id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await tx.insertInto('mood_log_scenario').values(moodLogScenarios).execute();
    return insertMoodLog;
  });
}

async function updateWithScenario(
  moodLog: MoodLogUpdate,
  moodLogScenarios: Insertable<MoodLogScenario>[]
) {
  const { id, log_date, mood, note } = moodLog;

  return await db.transaction().execute(async (tx) => {
    const updatedMoodLog = await tx
      .updateTable('mood_log')
      .set({
        log_date,
        mood,
        note,
        updated_at: new Date(),
      })
      .where('id', '=', moodLog.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    if (moodLogScenarios.length !== 0) {
      await tx.deleteFrom('mood_log_scenario').where('mood_log_id', '=', id).execute();
      await tx.insertInto('mood_log_scenario').values(moodLogScenarios).execute();
    }

    return updatedMoodLog;
  });
}

const MoodLogRepository = {
  findById,
  updateWithScenario,
  createWithScenario,
};

export { MoodLogRepository };
