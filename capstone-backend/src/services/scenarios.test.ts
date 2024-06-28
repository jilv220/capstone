import { describe, expect, test } from 'bun:test';
import type { Scenarios } from '@/schemas/scenario.ts';
import type { Category } from 'kysely-codegen';
import { ScenarioService } from './scenarios.ts';

describe('ScenarioService', () => {
  test('pluck name', () => {
    const scenarios: {
      id: string;
      name: Category;
    }[] = [
      {
        id: '1',
        name: 'bad_habits',
      },
      {
        id: '2',
        name: 'school',
      },
    ];

    const categories = ScenarioService.pluckName(scenarios);
    expect(categories).toEqual(['bad_habits', 'school']);
  });

  test('build moodlog scenarios', async () => {
    const scenarios: Scenarios = ['bad_habits', 'beauty'];
    const moodLogScenarios = await ScenarioService.buildMoodLogScenarios(scenarios, '1');
    for (const moodLogScenario of moodLogScenarios) {
      expect(moodLogScenario.mood_log_id).toBe('1');
      expect(moodLogScenario.scenario_id).toBeInteger();
    }
  });
});
