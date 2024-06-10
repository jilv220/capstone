import { db } from '@/db/db.ts';
import authMiddleware, { type AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { moodLogInsertSchema } from '@/schemas/mood_log.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { type Insertable, NoResultError } from 'kysely';
import type { MoodLogScenario } from 'kysely-codegen';
import { generateIdFromEntropySize } from 'lucia';

import { ScenarioRepository } from '@/repos/scenario.repo.ts';
import { ScenarioService } from '@/services/scenarios.ts';
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
  const scenarioByCategroy = R.map(scenariosByMoodLog, (group) =>
    ScenarioService.toCategorized(group)
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

  let moodLogScenarios: Insertable<MoodLogScenario>[] = [];
  try {
    moodLogScenarios = await ScenarioService.createMoodLogScenarios(scenario, mood_log_id);
  } catch (e) {
    if (e instanceof NoResultError)
      return c.json(
        {
          error: 'Invalid scenario',
        },
        400
      );
  }

  const moodLog = {
    id: mood_log_id,
    log_date,
    mood,
    note,
    user_id: user.id,
  };

  const res = await ScenarioRepository.insertOrUpdateMoodLog(moodLog, moodLogScenarios);
  return c.json(res);
});

export default user;
