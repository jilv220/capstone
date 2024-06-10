import { db } from '@/db/db.ts';
import authMiddleware, { type AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { moodLogInsertSchema } from '@/schemas/mood_log.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { type Insertable, NoResultError } from 'kysely';
import type { MoodLogScenario } from 'kysely-codegen';
import { generateIdFromEntropySize } from 'lucia';

import debug from 'debug';
import * as R from 'remeda';

const user = new Hono<AuthMiddlewareEnv>().basePath('/user');
const Debug = debug('app:api:user');

/**
 * We are not social media or blogging app?
 * Every access to user resource should be from user themselves?
 */
user.use('*', authMiddleware);

user.get('/me', async (c) => {
  const user = c.var.user;
  return c.json(user);
});

user.get('/mood-log', async (c) => {
  const user = c.var.user;
  const moodLogs = await db
    .selectFrom('mood_log')
    .selectAll()
    .where('user_id', '=', user.id)
    .execute();

  const scenariosByMoodLogPromise = R.map(moodLogs, (log) => {
    return db
      .selectFrom('mood_log_scenario')
      .innerJoin('scenario', 'scenario.id', 'mood_log_scenario.scenario_id')
      .select(['scenario.category', 'scenario.detail'])
      .where('mood_log_id', '=', log.id)
      .execute();
  });
  const scenariosByMoodLog = await Promise.all(scenariosByMoodLogPromise);

  const scenarioByCategroy = R.pipe(
    scenariosByMoodLog,
    R.map((group) => {
      return R.reduce(
        group,
        (obj, sc) => {
          return R.conditional(
            obj[sc.category],
            [R.isNullish, () => R.addProp(obj, sc.category, [sc.detail])],
            [R.isArray, (arr) => R.set(obj, sc.category, [...arr, sc.detail])]
          );
        },
        Object.create({})
      );
    })
  );

  const res = R.map(moodLogs, (log, idx) =>
    R.merge(log, {
      scenario: scenarioByCategroy[idx],
    })
  );

  return c.json(res);
});

user.post('/mood-log', zValidator('json', moodLogInsertSchema), async (c) => {
  const user = c.var.user;

  const mood_log_id = generateIdFromEntropySize(10);
  const log_date = c.req.valid('json').log_date;
  const mood = c.req.valid('json').mood;
  const note = c.req.valid('json').note;
  const scenario = c.req.valid('json').scenario;

  const scenarioPairs = R.pipe(
    scenario,
    R.entries,
    R.flatMap(([key, values]) => values.map((value: string) => [key, value]))
  );

  const scenarioIdsPromise = R.pipe(
    scenarioPairs,
    R.map((pair) =>
      db
        .selectFrom('scenario')
        .select('id')
        .where('category', '=', pair[0])
        .where('detail', '=', pair[1])
        .executeTakeFirstOrThrow()
        .then((res) => {
          return {
            mood_log_id,
            scenario_id: res.id,
          };
        })
    )
  );

  let scenarioIds: Insertable<MoodLogScenario>[] = [];
  try {
    scenarioIds = await Promise.all(scenarioIdsPromise);
  } catch (e) {
    if (e instanceof NoResultError)
      return c.json(
        {
          error: 'Invalid scenario',
        },
        400
      );
  }

  const res = await db.transaction().execute(async (tx) => {
    const newMoodLog = await tx
      .insertInto('mood_log')
      .values({
        id: mood_log_id,
        log_date,
        mood,
        note,
        user_id: user.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await tx.insertInto('mood_log_scenario').values(scenarioIds).executeTakeFirstOrThrow();
    return newMoodLog;
  });

  return c.json(res);
});

export default user;
