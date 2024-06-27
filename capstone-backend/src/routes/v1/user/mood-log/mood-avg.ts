import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { moodAvgQuerySchema } from '@/schemas/mood_log.ts';
import { MoodLogService } from '@/services/moodLog.ts';
import { moodToScore } from '@/utils/moodLog.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import * as R from 'remeda';

const avg = new Hono<AuthMiddlewareEnv>().basePath('/mood-avg');

avg.get('/', zValidator('query', moodAvgQuerySchema), async (c) => {
  const user = c.var.user;
  const prev = c.req.valid('query').prev;

  const moodLogsOfMonth = await MoodLogRepository.getMoodByMonth(user.id, prev);
  const res = MoodLogService.getDailyAvgScores(moodLogsOfMonth);
  return c.json(res);
});

export default avg;
