import { z } from 'zod';

export const scenarioResponseSchema = z.array(
  z.enum([
    'bad_habits',
    'beauty',
    'chores',
    'food',
    'health',
    'hobbies',
    'period_symptoms',
    'places',
    'productivity',
    'romance',
    'school',
    'sleep',
    'social',
    'weather',
    'work',
  ])
);

export type Scenarios = z.infer<typeof scenarioResponseSchema>;
