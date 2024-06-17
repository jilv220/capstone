import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { Hono } from 'hono';

import * as R from 'remeda';

const moodLogStreak = new Hono<AuthMiddlewareEnv>().basePath('/mood-log-streak');

moodLogStreak.get('/', async (c) => {
  const user = c.var.user;
  const streak = await MoodLogRepository.getStreak(user.id);

  const res = R.pipe(
    streak,
    R.map(R.prop('has_mood_log')),
    R.reduce((acc, st) => {
      return R.conditional(
        st,
        [R.isTruthy, (st) => acc + 1],
        R.conditional.defaultCase((st) => acc)
      );
    }, 0)
  );

  return c.json(res);
});

export default moodLogStreak;
