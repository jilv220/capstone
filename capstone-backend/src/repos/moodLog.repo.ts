import { db } from '@/db/db.ts';
import type { MoodLogCreate, MoodLogUpdate } from '@/interfaces/moodLog.ts';
import type { Insertable, Updateable } from 'kysely';
import type { MoodLog, MoodLogScenario } from 'kysely-codegen';

async function findById(id: string) {
  return await db.selectFrom('mood_log').selectAll().where('id', '=', id).executeTakeFirst();
}

async function findByIdAndUserId(id: string, userId: string) {
  return await db
    .selectFrom('mood_log')
    .selectAll()
    .where('id', '=', id)
    .where('user_id', '=', userId)
    .executeTakeFirst();
}

async function findScenariosById(id: string) {
  return await db
    .selectFrom('mood_log_scenario')
    .innerJoin('scenario', 'scenario.id', 'mood_log_scenario.scenario_id')
    .select(['scenario.name'])
    .where('mood_log_id', '=', id)
    .execute();
}

async function deleteById(id: string) {
  return await db.deleteFrom('mood_log').where('id', '=', id).executeTakeFirst();
}

async function deleteByIdAndUserId(id: string, userId: string) {
  return await db
    .deleteFrom('mood_log')
    .where('id', '=', id)
    .where('user_id', '=', userId)
    .executeTakeFirst();
}

async function createWithScenarios(
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

async function updateWithScenarios(
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
  findByIdAndUserId,
  findScenariosById,
  deleteById,
  deleteByIdAndUserId,
  updateWithScenarios,
  createWithScenarios,
};

export { MoodLogRepository };
