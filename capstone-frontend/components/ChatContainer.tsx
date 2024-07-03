import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, YStack, useTheme } from 'tamagui';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Platform } from 'react-native';
import {
  renderAvatar,
  renderBubble,
  renderInputToolbar,
  renderMessage,
  renderMessageText,
  renderSystemMessage,
  renderTime,
  FootComponent,
} from '@/components/MessageContainer';
import { chatProps } from '@/interfaces/chat';

const ChatContainer: React.FC<chatProps> = ({ initialMessages, saveMessages }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const theme = useTheme();

  useEffect(() => {
    setMessages(initialMessages.reverse());
  }, [initialMessages]);

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
      renderInputToolbar={(props) => renderInputToolbar(props, theme)}
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
