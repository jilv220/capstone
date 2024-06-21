import { db } from '@/db/db.ts';
import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { moodLogCreateSchema, moodLogUpdateSchema } from '@/schemas/mood_log.ts';
import { ScenarioService } from '@/services/scenarios.ts';
import { serverError } from '@/utils/hono.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { type Insertable, NoResultError } from 'kysely';
import type { MoodLogScenario } from 'kysely-codegen';
import { generateIdFromEntropySize } from 'lucia';

import * as R from 'remeda';
import count from './count.ts';
import streak from './streak.ts';

const moodLog = new Hono<AuthMiddlewareEnv>().basePath('/mood-log');
moodLog.route('/', count);
moodLog.route('/', streak);

moodLog.get('/', async (c) => {
  const user = c.var.user;
  const moodLogs = await db
    .selectFrom('mood_log')
    .selectAll()
    .where('user_id', '=', user.id)
    .execute();

  const scenariosByMoodLogPromise = R.map(moodLogs, (log) =>
    MoodLogRepository.findScenariosById(log.id)
  );
  const scenariosByMoodLog = R.pipe(
    await Promise.all(scenariosByMoodLogPromise),
    R.map((sc) => ScenarioService.pluckName(sc))
  );

  const res = R.map(moodLogs, (log, idx) =>
    R.merge(log, {
      scenario: scenariosByMoodLog[idx],
    })
  );

  return c.json(res);
});

moodLog.post('/', zValidator('json', moodLogCreateSchema), async (c) => {
  const user = c.var.user;

  const mood_log_id = generateIdFromEntropySize(10);
  const log_date = c.req.valid('json').log_date;
  const mood = c.req.valid('json').mood;
  const note = c.req.valid('json').note;
  const scenario = c.req.valid('json').scenario;

  let moodLogScenarios: Insertable<MoodLogScenario>[] = [];
  try {
    moodLogScenarios = await ScenarioService.buildMoodLogScenarios(scenario, mood_log_id);
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

  try {
    const res = await MoodLogRepository.createWithScenarios(moodLog, moodLogScenarios);
    return c.json(res);
  } catch (e) {
    console.error(e);
    return serverError(c);
  }
});

moodLog.get('/:id', async (c) => {
  const user = c.var.user;
  const moodLogId = c.req.param('id');

  try {
    const result = await MoodLogRepository.findByIdAndUserId(moodLogId, user.id);
    if (!result) return c.notFound();

    const scenarios = R.pipe(
      await MoodLogRepository.findScenariosById(moodLogId),
      ScenarioService.pluckName
    );

    const res = R.merge(result, {
      scenario: scenarios,
    });

    return c.json(res);
  } catch (e) {
    console.error(e);
    return serverError(c);
  }
});

moodLog.patch('/:id', zValidator('json', moodLogUpdateSchema), async (c) => {
  const user = c.var.user;
  const moodLogId = c.req.param('id');

  const log_date = c.req.valid('json').log_date;
  const mood = c.req.valid('json').mood;
  const note = c.req.valid('json').note;
  const scenario = c.req.valid('json').scenario;

  // Not Found
  const existingMoodLog = await MoodLogRepository.findByIdAndUserId(moodLogId, user.id);
  if (!existingMoodLog) return c.notFound();

  const moodLog = {
    id: moodLogId,
    log_date,
    mood,
    note,
    user_id: user.id,
  };

  let moodLogScenarios: Insertable<MoodLogScenario>[] = [];
  if (scenario) {
    try {
      moodLogScenarios = await ScenarioService.buildMoodLogScenarios(scenario, moodLogId);
    } catch (e) {
      if (e instanceof NoResultError)
        return c.json(
          {
            error: 'Invalid scenario',
          },
          400
        );
    }
  }

  try {
    const res = await MoodLogRepository.updateWithScenarios(moodLog, moodLogScenarios);
    return c.json(res);
  } catch (e) {
    console.error(e);
    return serverError(c);
  }
});

moodLog.delete('/:id', async (c) => {
  const user = c.var.user;
  const moodLogId = c.req.param('id');

  try {
    const result = await MoodLogRepository.deleteByIdAndUserId(moodLogId, user.id);

    if (result.numDeletedRows !== BigInt(0)) {
      return c.newResponse(null, 202);
    }

    return c.notFound();
  } catch (e) {
    console.error(e);
    return serverError(c);
  }
});

export default moodLog;
