import { db } from '@/db/db.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import type { Scenarios } from '@/schemas/scenario.ts';
import { pluck } from '@/utils/base.ts';
import { NoResultError, type Selectable } from 'kysely';
import type { Scenario } from 'kysely-codegen';

import * as R from 'remeda';

function pluckName(scenarios: Omit<Selectable<Scenario>, 'id'>[]) {
  return pluck(scenarios, 'name');
}

async function buildMoodLogScenarios(scenarios: Scenarios, mood_log_id: string) {
  const moodLogScenariosPromise = R.pipe(
    scenarios,
    R.map((sc) =>
      MoodLogRepository.findScenarioByName(sc).then((res) => {
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
