import { z } from 'zod';
import { scenarioResponseSchema } from './scenario.ts';

export const moodLogInsertSchema = z.object({
  log_date: z.string().datetime(),
  mood: z.enum(['awful', 'bad', 'good', 'meh', 'rad']),
  note: z.string().optional(),
  scenario: scenarioResponseSchema,
});

export const moodLogUpdateSchema = moodLogInsertSchema.partial();
type t2 = z.infer<typeof moodLogUpdateSchema>;
