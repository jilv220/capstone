import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { MoodLogService } from '@/services/moodLog.ts';
import { Hono } from 'hono';

import * as R from 'remeda';

const streak = new Hono<AuthMiddlewareEnv>().basePath('/streak');

streak.get('/', async (c) => {
  const user = c.var.user;
  const res = R.pipe(await MoodLogRepository.getStreak(user.id), MoodLogService.getStreakHistory);
  return c.json(res);
});

export default streak;
