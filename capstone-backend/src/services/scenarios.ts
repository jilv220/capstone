import { db } from '@/db/db.ts';
import type { Scenarios } from '@/schemas/scenario.ts';
import { NoResultError, type Selectable } from 'kysely';
import type { Scenario } from 'kysely-codegen';

import * as R from 'remeda';

function pluckName(scenarios: Omit<Selectable<Scenario>, 'id'>[]) {
  return R.map(scenarios, (sc) => R.prop(sc, 'name'));
}

async function buildMoodLogScenarios(scenarios: Scenarios, mood_log_id: string) {
  const moodLogScenariosPromise = R.pipe(
    scenarios,
    R.map((sc) =>
      db
        .selectFrom('scenario')
        .select('id')
        .where('name', '=', sc)
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
  pluckName,
  buildMoodLogScenarios,
};

export { ScenarioService };
