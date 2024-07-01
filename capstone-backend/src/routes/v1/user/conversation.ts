import { db } from '@/db/db.ts';
import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { ChatRepository } from '@/repos/chat.ts';
import { ConversationRepository } from '@/repos/conversation.ts';
import { chatJsonSchema } from '@/schemas/conversation.ts';
import { OpenAIService } from '@/services/openAI.ts';
import { serverError } from '@/utils/hono.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import * as R from 'remeda';

const conversation = new Hono<AuthMiddlewareEnv>().basePath('/conversation');

conversation.get('/', async (c) => {
  const user = c.var.user;
  const res = await ConversationRepository.findByUserId(user.id);
  return c.json(res);
});

conversation.post('/', async (c) => {
  const user = c.var.user;

  const res = await ConversationRepository.create(user.id);
  if (!res) return serverError(c);

  return c.json(res);
});

conversation.get('/:id', async (c) => {
  const conversationId = c.req.param('id');

  const existingConversation = await ConversationRepository.findById(conversationId);
  if (!existingConversation) return c.notFound();

  const existingChats = R.pipe(
    await ChatRepository.findByConversationId(conversationId),
    R.map(R.omit(['ai_conversation_id']))
  );

  return c.json(existingChats);
});

conversation.post('/:id', zValidator('json', chatJsonSchema), async (c) => {
  const user = c.var.user;
  const conversationId = c.req.param('id');
  const content = c.req.valid('json').content;

  const existingConversation = await ConversationRepository.findById(conversationId);
  if (!existingConversation) return c.notFound();

  // Updates the title only if no chat in conversation
  const existingChats = await ChatRepository.findByConversationId(conversationId);
  const isFirstChat = existingChats.length === 0;

  const chatResponseP = OpenAIService.generateChatResponse({
    userId: user.id,
    conversationId,
    content,
  });
  const titleP = OpenAIService.generateTitle(content);
  const [chatResponse, title] = await Promise.all([
    chatResponseP,
    isFirstChat ? titleP : undefined,
  ]);

  const updatedConversation = await db.transaction().execute(async (tx) => {
    await ChatRepository.create(
      {
        ai_conversation_id: conversationId,
        content,
        role: 'user',
      },
      tx
    );

    await ChatRepository.create(
      {
        ai_conversation_id: conversationId,
        content: chatResponse || 'unknown error',
        role: 'assistant',
      },
      tx
    );

    if (isFirstChat) {
      await ConversationRepository.update({
        id: conversationId,
        title,
      });
    }

    return await ConversationRepository.update(
      {
        id: conversationId,
        updated_at: new Date(),
      },
      tx
    );
  });

  return c.json({
    ...updatedConversation,
    response: chatResponse,
  });
});

export default conversation;
