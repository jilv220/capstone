import { z } from 'zod';

export const scenarioResponseSchema = z.object({
  bad_habits: z.array(z.string()),
  beauty: z.array(z.string()),
  chores: z.array(z.string()),
  emotions: z.array(z.string()),
  food: z.array(z.string()),
  health: z.array(z.string()),
  hobbies: z.array(z.string()),
  period_symptoms: z.array(z.string()),
  places: z.array(z.string()),
  productivity: z.array(z.string()),
  romance: z.array(z.string()),
  school: z.array(z.string()),
  sleep: z.array(z.string()),
  social: z.array(z.string()),
  weather: z.array(z.string()),
  work: z.array(z.string()),
});

export type ScenarioByCategroy = Partial<z.infer<typeof scenarioResponseSchema>>;
