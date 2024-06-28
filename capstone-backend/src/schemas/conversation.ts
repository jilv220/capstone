import type { Insertable } from 'kysely';
import type { AiChat, AiConversation } from 'kysely-codegen';
import { z } from 'zod';

export const conversationCreateSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

export const chatJsonSchema = z.object({
  content: z.string(),
});

type t1 = Insertable<AiConversation>;
type t2 = Insertable<AiChat>;
