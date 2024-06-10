import { db } from '@/db/db.ts';
import type { ScenarioByCategroy } from '@/schemas/scenario.ts';
import { NoResultError, type Selectable } from 'kysely';
import type { Scenario } from 'kysely-codegen';

import * as R from 'remeda';

function toCategorized(scenarios: Omit<Selectable<Scenario>, 'id'>[]): ScenarioByCategroy {
  return R.reduce(
    scenarios,
    (obj, sc) => {
      return R.conditional(
        obj[sc.category],
        [R.isNullish, () => R.addProp(obj, sc.category, [sc.detail])],
        [R.isArray, (arr) => R.set(obj, sc.category, [...arr, sc.detail])]
      );
    },
    Object.create({})
  );
}

async function createMoodLogScenarios(scenario: ScenarioByCategroy, mood_log_id: string) {
  const scenarioPairs = R.pipe(
    scenario,
    R.entries,
    R.flatMap(([key, values]) => values.map((value: string) => [key, value]))
  );

  const moodLogScenariosPromise = R.pipe(
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

  return await Promise.all(moodLogScenariosPromise);
}

const ScenarioService = {
  toCategorized,
  createMoodLogScenarios,
};

export { ScenarioService };
