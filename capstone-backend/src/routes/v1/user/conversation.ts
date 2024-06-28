import { Conf } from '@/config.ts';
import { db } from '@/db/db.ts';
import type { ValidChatMessageRole } from '@/interfaces/base.ts';
import type { AuthMiddlewareEnv } from '@/middlewares/auth.ts';
import { ChatRepository } from '@/repos/chat.ts';
import { ConversationRepository } from '@/repos/conversation.ts';
import { MoodLogRepository } from '@/repos/moodLog.repo.ts';
import { chatJsonSchema } from '@/schemas/conversation.ts';
import { MoodLogService } from '@/services/moodLog.ts';
import { serverError } from '@/utils/hono.ts';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { ChatCompletionMessageParam } from 'openai/src/resources/index.js';

import OpenAI from 'openai';
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

conversation.post('/:id', zValidator('json', chatJsonSchema), async (c) => {
  const user = c.var.user;
  const conversationId = c.req.param('id');
  const content = c.req.valid('json').content;

  const existingConversation = await ConversationRepository.findById(conversationId);
  if (!existingConversation) return c.notFound();

  const moodLogs = await MoodLogRepository.findByUserId(user.id);
  const scenariosByMoodLogPromise = R.map(moodLogs, (log) =>
    MoodLogRepository.findScenariosByMoodLogId(log.id)
  );

  const moodLogsWithScenarios = await MoodLogService.getMoodLogWithScenarios(
    moodLogs,
    scenariosByMoodLogPromise
  );

  const moodLogSummary = R.pipe(
    moodLogsWithScenarios,
    R.reduce((summary: string[], moodLog) => {
      const nextEntry =
        `Date: ${moodLog.log_date.toISOString()}\n` +
        `Mood: ${moodLog.mood}\n` +
        `Note: ${moodLog.note}\n` +
        `Scenarios: ${moodLog.scenario.join(',')}\n`;

      return R.concat(summary, [nextEntry]);
    }, []),
    R.join('\n')
  );

  const chatHistory = R.pipe(
    await ChatRepository.findByConversationId(conversationId),
    R.map((chat) => ({
      role: chat.role as unknown as ValidChatMessageRole,
      content: chat.content,
    }))
  );

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a professional and compassionate therapy assistant. \
        Use the following mood logs to provide context-aware support to the user.',
    },
    {
      role: 'system',
      content: moodLogSummary,
    },
    ...chatHistory,
    {
      role: 'user',
      content,
    },
  ];

  const openai = new OpenAI({
    apiKey: Conf.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  await db.transaction().execute(async (tx) => {
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
        content: completion.choices[0].message.content || 'unknown error',
        role: 'assistant',
      },
      tx
    );
  });

  // TODO: Transform data into shape frontend want
  return c.json(completion.choices[0]);
});

export default conversation;
