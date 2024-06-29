import type { ValidChatMessageRole } from '@/interfaces/base.ts';
import { ChatRepository, type TChatRepository } from '@/repos/chat.ts';

import * as R from 'remeda';

async function getHistory(conversationId: string, repository: TChatRepository = ChatRepository) {
  return R.pipe(
    await repository.findByConversationId(conversationId),
    R.map((chat) => ({
      role: chat.role as unknown as ValidChatMessageRole,
      content: chat.content,
    }))
  );
}

const ChatService = { getHistory };

export { ChatService };
