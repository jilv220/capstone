import { z } from 'zod';

export const articleCreateSchema = z.object({
  resource_name: z.string(),
  title: z.string(),
  content: z.string(),
});

export const articleBatchCreateSchema = articleCreateSchema.array();
