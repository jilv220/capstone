import { Conf } from '@/config.ts';
import type { ValidChatMessageRole } from '@/interfaces/base.ts';

import { ChatRepository, TChatRepository } from '@/repos/chat.ts';
import OpenAI from 'openai';
import * as R from 'remeda';
import { ChatService } from './chat.ts';
import { MoodLogService } from './moodLog.ts';

const openai = new OpenAI({
  apiKey: Conf.OPENAI_API_KEY,
});

function buildChatCompletionMessage(role: ValidChatMessageRole, content: string) {
  return {
    role,
    content,
  };
}

async function generateTitle(content: string) {
  const systemMessage = buildChatCompletionMessage(
    'system',
    "Based on the user's input and the context of the conversation, \
    please generate a suitable title for this conversation.\
    Output JSON with the following format: {'title': <Your Response>}"
  );
  const userMessage = buildChatCompletionMessage('user', content);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, userMessage],
    response_format: {
      type: 'json_object',
    },
  });

  const response = completion.choices[0].message.content || 'Failed to respond';

  let title = 'Parsing Error or Model failed to respond';
  try {
    const obj = JSON.parse(response);
    if (obj.title) {
      title = obj.title;
    }
  } catch {}

  return title;
}

async function generateChatResponse({
  userId,
  conversationId,
  content,
}: {
  userId: string;
  conversationId: string;
  content: string;
}) {
  const [moodLogsWithScenarios, chatHistory] = await Promise.all([
    MoodLogService.getMoodLogsWithScenarios(userId),
    ChatService.getHistory(conversationId),
  ]);

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

  const systemMessage = buildChatCompletionMessage(
    'system',
    'You are a professional and compassionate therapy assistant. \
    Use the following mood logs to provide context-aware support to the user.'
  );
  const summaryMessage = buildChatCompletionMessage('system', moodLogSummary);
  const userMessage = buildChatCompletionMessage('user', content);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, summaryMessage, ...chatHistory, userMessage],
  });

  return completion.choices[0].message.content;
}

const OpenAIService = { generateTitle, generateChatResponse };

export { OpenAIService };
