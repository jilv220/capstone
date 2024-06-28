import { db } from '@/db/db.ts';
import type { Insertable, Kysely, Transaction } from 'kysely';
import type { AiChat, DB } from 'kysely-codegen';
import { v7 as uuidv7 } from 'uuid';

// bruh...
async function create(
  { ai_conversation_id, content, role }: Omit<Insertable<AiChat>, 'id'>,
  dbOrTx: Kysely<DB> | Transaction<DB> = db
) {
  return await dbOrTx
    .insertInto('ai_chat')
    .values({
      id: uuidv7(),
      ai_conversation_id,
      content,
      role,
    })
    .returningAll()
    .executeTakeFirst();
}

async function findByConversationId(conversationId: string) {
  return await db
    .selectFrom('ai_chat')
    .selectAll()
    .where('ai_conversation_id', '=', conversationId)
    .execute();
}

const ChatRepository = { findByConversationId, create };

export { ChatRepository };
