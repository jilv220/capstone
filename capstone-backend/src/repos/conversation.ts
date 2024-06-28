import { db } from '@/db/db.ts';

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

const ConversationRepository = { findById, findByUserId, create };

export { ConversationRepository };
