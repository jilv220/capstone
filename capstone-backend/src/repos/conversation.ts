import { db } from '@/db/db.ts';
import type { Kysely, Transaction, Updateable } from 'kysely';
import type { AiConversation, DB } from 'kysely-codegen';

import { v7 as uuidv7 } from 'uuid';

async function findByUserId(userId: string) {
  return await db.selectFrom('ai_conversation').selectAll().where('user_id', '=', userId).execute();
}

async function findById(id: string) {
  return await db.selectFrom('ai_conversation').selectAll().where('id', '=', id).executeTakeFirst();
}

async function create(userId: string) {
  return await db
    .insertInto('ai_conversation')
    .values({
      id: uuidv7(),
      user_id: userId,
    })
    .returningAll()
    .executeTakeFirst();
}

async function update(
  conversation: Omit<Updateable<AiConversation>, 'id'> & { id: string },
  dbOrTx: Kysely<DB> | Transaction<DB> = db
) {
  return await dbOrTx
    .updateTable('ai_conversation')
    .set(conversation)
    .where('id', '=', conversation.id)
    .returningAll()
    .executeTakeFirst();
}

const ConversationRepository = { findById, findByUserId, create, update };

export { ConversationRepository };
