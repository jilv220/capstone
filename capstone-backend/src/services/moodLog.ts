import { MoodLogRepository, type TMoodLogRepository } from '@/repos/moodLog.repo.ts';
import { moodToScore } from '@/utils/moodLog.ts';
import type { Mood, MoodLog } from 'kysely-codegen';
import { ScenarioService } from './scenarios.ts';

import debug from 'debug';
import * as R from 'remeda';

const Debug = debug('service:moodLog');

async function getMoodLogsWithScenarios(
  userId: string,
  repository: TMoodLogRepository = MoodLogRepository
) {
  const moodLogs = await repository.findByUserId(userId);
  const scenariosByMoodLogPromise = R.map(moodLogs, (log) =>
    MoodLogRepository.findScenariosByMoodLogId(log.id)
  );

  const scenariosByMoodLog = R.pipe(
    await Promise.all(scenariosByMoodLogPromise),
    R.map((sc) => ScenarioService.pluckName(sc))
  );

  return R.map(moodLogs, (log, idx) =>
    R.merge(log, {
      scenario: scenariosByMoodLog[idx],
    })
  );
}

function getStreakHistory(
  streakData: {
    log_date: Date;
    has_mood_log: boolean;
  }[]
) {
  let counter = 0;
  let res = R.pipe(
    streakData,
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
          const nextGroup = R.concat(arr, [counter]);
          counter = 0;
          return nextGroup;
        })
      );
    }, [])
  );

  // Append the last group
  res = [...res, counter];
  Debug(res);

  return {
    current: R.first(res),
    longest: R.firstBy(res, [R.identity(), 'desc']),
  };
}

function aggregateMoodScores(
  moodScores: Array<{
    log_date: Date;
    score: number;
  }>
) {
  return R.reduce(
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
}

function getDailyAvgScores(
  moodLogs: {
    mood: Mood;
    log_date: Date;
  }[]
) {
  const moodScores = R.pipe(
    moodLogs,
    R.map(({ log_date, mood }) => {
      return {
        log_date,
        score: moodToScore(mood),
      };
    })
  );

  const avgs = R.pipe(
    moodScores,
    aggregateMoodScores,
    R.values(),
    R.map((v) => v.score / v.count)
  );

  return R.pipe(
    moodScores,
    R.map(R.prop('log_date')),
    // Cannot dedup Date with Set
    R.map((date) => date.toISOString()),
    R.unique(),
    R.map((log_date, index) => {
      return {
        log_date: log_date,
        avg_score: avgs[index],
      };
    }),
    R.sort((a, b) => (a.log_date > b.log_date ? 1 : -1))
  );
}

const MoodLogService = {
  getMoodLogsWithScenarios,
  getStreakHistory,
  getDailyAvgScores,
  aggregateMoodScores,
};

export { MoodLogService };
