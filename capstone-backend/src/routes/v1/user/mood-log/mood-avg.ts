import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { moodAvgQuerySchema } from '@/schemas/mood_log.ts';
import { moodToScore } from '@/utils/moodlog.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import * as R from 'remeda';

const avg = new Hono<AuthMiddlewareEnv>().basePath('/mood-avg');

avg.get('/', zValidator('query', moodAvgQuerySchema), async (c) => {
  const user = c.var.user;
  const prev = c.req.valid('query').prev;

  const moods = await MoodLogRepository.getMoodByMonth(user.id, prev);
  const moodScores = R.pipe(
    moods,
    R.map(({ log_date, mood }) => {
      return {
        log_date,
        score: moodToScore(mood),
      };
    })
  );

  const aggregatedMoodScores = R.reduce(
    moodScores,
    (acc, { log_date, score }) => {
      const logDateString = log_date.toISOString();
      const afterEvolve = R.evolve(acc[logDateString] ?? { count: 0, score: 0 }, {
        score: R.add(score),
        count: R.add(1),
      });

      return R.set(acc, logDateString, afterEvolve);
    },
    Object.create({}) as Record<
      string,
      {
        score: number;
        count: number;
      }
    >
  );

  const avgs = R.pipe(
    aggregatedMoodScores,
    R.values(),
    R.map((v) => v.score / v.count)
  );

  const res = R.pipe(
    moodScores,
    R.map(R.prop('log_date')),
    R.uniqueWith(R.isDeepEqual),
    R.map((log_date, index) => {
      return {
        log_date: log_date as string,
        avg_score: avgs[index],
      };
    }),
    R.sort((a, b) => (a.log_date > b.log_date ? 1 : -1))
  );

  return c.json(res);
});

export default avg;
