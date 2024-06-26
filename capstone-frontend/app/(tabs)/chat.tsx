import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, YStack, useTheme } from 'tamagui';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import { Platform } from 'react-native';
export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'hello',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Chatty',
          avatar: '@/assets/images/avatar.png',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
