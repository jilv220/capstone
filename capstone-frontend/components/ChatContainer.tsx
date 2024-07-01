import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, YStack, useTheme } from 'tamagui';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Platform } from 'react-native';
import {
  renderAvatar,
  renderBubble,
  // renderFooter,
  renderInputToolbar,
  renderMessage,
  renderMessageText,
  renderSystemMessage,
  renderTime,
  FootComponent,
} from '@/components/MessageContainer';

const ChatContainer = () => {
  const initialMessages: IMessage[] = [
    {
      _id: 1,
      text: "hello,I'm Ivy, and I feel a little bit down today.",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Ivy',
        avatar: require('../assets/images/user_avatar.png'),
      },
    },
    {
      _id: 2,
      text: 'Hello! How can I help you today?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Chaty',
        avatar: require('../assets/images/ai_avatar.png'),
      },
      image: '',
    },
    {
      _id: 3,
      text: "My name is Chatty, I'm happy to help you with anything you need. How's your day today?",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Chatty',
        avatar: require('../assets/images/ai_avatar.png'),
      },
    },
    {
      _id: 0,
      text: 'welcome to the AI chatbot',
      createdAt: new Date('2024-06-25T03:24:00'),
      user: {
        _id: 2,
        name: 'Chatty',
        avatar: require('../assets/images/ai_avatar.png'),
      },
    },
  ];

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  const handleQuickOptions = (option: string) => {
    onSend([
      {
        _id: new Date().toISOString(),
        text: option,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Ivy',
          avatar: require('../assets/images/user_avatar.png'),
        },
      },
    ]);
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderBubble={renderBubble}
      renderAvatar={renderAvatar}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      showAvatarForEveryMessage={true}
      showUserAvatar={true}
      isLoadingEarlier={true}
      renderTime={renderTime}
      renderInputToolbar={renderInputToolbar}
      renderFooter={() => <FootComponent onPressQuickOptions={handleQuickOptions} />}
      user={{
        _id: 1,
        name: 'ivy',
        avatar: require('../assets/images/user_avatar.png'),
      }}
    />
  );
};

export default ChatContainer;
