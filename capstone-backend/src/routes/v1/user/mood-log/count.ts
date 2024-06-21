import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { moodLogCountQuerySchema } from '@/schemas/mood_log.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { Mood } from 'kysely-codegen';

import * as R from 'remeda';

const count = new Hono<AuthMiddlewareEnv>().basePath('/count');

count.get('/', zValidator('query', moodLogCountQuerySchema), async (c) => {
  const user = c.var.user;
  const prev = c.req.valid('query').prev;
  const next = c.req.valid('query').next;

  const moodCountByMonth = await MoodLogRepository.getMoodCountByMonth(user.id, prev, next);

  const res = R.mapToObj(['rad', 'good', 'meh', 'bad', 'awful'] as Mood[], (mood) => [mood, 0]);
  for (const { mood, mood_count } of moodCountByMonth) {
    res[mood] = Number.parseInt(mood_count);
  }

  return c.json(res);
});

export default count;
