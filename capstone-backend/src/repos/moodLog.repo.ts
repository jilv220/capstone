import { db } from '@/db/db.ts';
import { NotValidMonthError } from '@/interfaces/base.ts';
import type { MoodLogCreate, MoodLogUpdate } from '@/interfaces/moodLog.ts';
import { type Insertable, type Updateable, sql } from 'kysely';
import type { Category, MoodLog, MoodLogScenario, Scenario } from 'kysely-codegen';

async function findById(id: string) {
  return await db.selectFrom('mood_log').selectAll().where('id', '=', id).executeTakeFirst();
}

async function findByUserId(userId: string) {
  return await db.selectFrom('mood_log').selectAll().where('user_id', '=', userId).execute();
}

async function findByIdAndUserId(id: string, userId: string) {
  return await db
    .selectFrom('mood_log')
    .selectAll()
    .where('id', '=', id)
    .where('user_id', '=', userId)
    .executeTakeFirst();
}

async function findScenarioByName(name: Category) {
  return await db
    .selectFrom('scenario')
    .select('id')
    .where('name', '=', name)
    .executeTakeFirstOrThrow();
}

async function findScenariosByMoodLogId(moodLogId: string) {
  return await db
    .selectFrom('mood_log_scenario')
    .innerJoin('scenario', 'scenario.id', 'mood_log_scenario.scenario_id')
    .select(['scenario.name'])
    .where('mood_log_id', '=', moodLogId)
    .execute();
}

async function getStreak(userId: string) {
  return await db
    .with('days', (db) =>
      db.selectNoFrom((eb) =>
        eb
          .fn<Date>('generate_series', [
            sql`date_trunc('day', now()) - '365 day'::interval`,
            sql`date_trunc('day', now())`,
            sql`'1 day'::interval`,
          ])
          .as('day')
      )
    )
    .selectFrom('days')
    .leftJoin('mood_log', (eb) =>
      eb
        .onRef('days.day', '=', sql`date_trunc('day', mood_log.log_date)`)
        .on('mood_log.user_id', '=', userId)
    )
    .select([
      'days.day as log_date',
      sql<boolean>`CASE WHEN count(mood_log.id) > 0 THEN true ELSE false END`.as('has_mood_log'),
    ])
    .groupBy('days.day')
    .orderBy('days.day', 'desc')
    .execute();
}

async function getMoodCountByMonth(userId: string, prev?: number) {
  let query = db
    .selectFrom('mood_log')
    .select((eb) => ['mood', eb.fn<string>('count', ['mood']).as('mood_count')])
    .where('user_id', '=', userId);

  if (prev) {
    const prevNMonth = sql.lit(`${prev} month`);
    query = query.where((eb) => {
      const log_month = eb.fn<Date>('date_trunc', [eb.val('month'), 'log_date']);
      const past_month = eb.fn<Date>('date_trunc', [
        eb.val('month'),
        sql`now() - interval ${prevNMonth}`,
      ]);
      return eb(log_month, '=', past_month);
    });

    return await query.groupBy('mood').execute();
  }

  return await query
    .where((eb) => {
      const log_month = eb.fn<Date>('date_trunc', [eb.val('month'), 'log_date']);
      const current_month = eb.fn<Date>('date_trunc', [eb.val('month'), sql`now()`]);
      return eb(log_month, '=', current_month);
    })
    .groupBy('mood')
    .execute();
}

async function getMoodByMonth(userId: string, prev?: number) {
  let query = db
    .selectFrom('mood_log')
    .select((eb) => ['mood', eb.fn<Date>('date_trunc', [eb.val('day'), 'log_date']).as('log_date')])
    .where('user_id', '=', userId);

  // Only prev is possible...
  if (prev) {
    const prevNMonth = sql.lit(`${prev} month`);
    query = query.where((eb) => {
      const log_month = eb.fn<Date>('date_trunc', [eb.val('month'), 'log_date']);
      const past_month = eb.fn<Date>('date_trunc', [
        eb.val('month'),
        sql`now() - interval ${prevNMonth}`,
      ]);
      return eb(log_month, '=', past_month);
    });

    return await query.execute();
  }

  return await query
    .where((eb) => {
      const log_month = eb.fn<Date>('date_trunc', [eb.val('month'), 'log_date']);
      const current_month = eb.fn<Date>('date_trunc', [eb.val('month'), sql`now()`]);
      return eb(log_month, '=', current_month);
    })
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
  findByUserId,
  findByIdAndUserId,
  findScenarioByName,
  findScenariosByMoodLogId,
  getStreak,
  getMoodByMonth,
  getMoodCountByMonth,
  deleteById,
  deleteByIdAndUserId,
  updateWithScenarios,
  createWithScenarios,
};

export { MoodLogRepository };
