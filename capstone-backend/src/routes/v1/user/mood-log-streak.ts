import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { Hono } from 'hono';

import * as R from 'remeda';

const moodLogStreak = new Hono<AuthMiddlewareEnv>().basePath('/mood-log-streak');

moodLogStreak.get('/', async (c) => {
  const user = c.var.user;
  const streak = await MoodLogRepository.getStreak(user.id);

  let counter = 0;
  const res = R.pipe(
    streak,
    R.map(R.prop('has_mood_log')),
    R.reduce((arr: number[], hasMoodLog) => {
      return R.conditional(
        hasMoodLog,
        [
          R.isTruthy,
          () => {
            counter += 1;
            return arr;
          },
        ],
        R.conditional.defaultCase(() => {
          const nextGroup = counter === 0 ? arr : R.concat(arr, [counter]);
          counter = 0;
          return nextGroup;
        })
      );
    }, [])
  );

  return c.json({
    current: R.first(res),
    longest: R.firstBy(res, [R.identity(), 'desc']),
  });
});

export default moodLogStreak;
