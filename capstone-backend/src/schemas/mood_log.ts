import { z } from 'zod';
import { scenarioResponseSchema } from './scenario.ts';

export const moodLogCreateSchema = z.object({
  log_date: z.string().datetime(),
  mood: z.enum(['awful', 'bad', 'good', 'meh', 'rad']),
  note: z.string().optional(),
  scenario: scenarioResponseSchema,
});

export const moodLogCountQuerySchema = z.object({
  prev: z.coerce.number().positive().optional(),
  next: z.coerce.number().positive().optional(),
});

export const moodLogUpdateSchema = moodLogCreateSchema.partial();
type t2 = z.infer<typeof moodLogUpdateSchema>;
