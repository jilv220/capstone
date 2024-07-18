import { useEffect, useState } from 'react';
import { Text, useTheme } from 'tamagui';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  convertConversation,
  createConversation,
  createMessage,
  getAllMessages,
  getConversations,
} from '@/actions/chat';
import { Appearance } from 'react-native';

type ChatContainerProps = {
  conversationId?: string;
};

const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId }) => {
  // Have to use useState here. We have no internal access to the gifted chat component...
  const [initialMessages, setInitialMessages] = useState<IMessage[]>([]);

  const theme = useTheme();
  const colorMode = Appearance.getColorScheme();
  const queryClient = useQueryClient();
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onError: (e) => {
      console.error(e);
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variable.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const { data: messagesFromServer, isError } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: ({ queryKey }) => getAllMessages(queryKey[1]!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (messagesFromServer) {
      setInitialMessages(convertConversation(messagesFromServer).reverse());
    }
  }, [messagesFromServer]);

  const onSend = async (messages: IMessage[] = []) => {
    let conversationIdLocal = conversationId;

    // Create conversation if there is none
    if (conversationId === undefined) {
      try {
        const { id } = await createConversationMutation.mutateAsync();
        conversationIdLocal = id;
      } catch (e) {
        console.error(e);
      }
    }

    // Optimistic update
    let oldMessages: IMessage[] = [];
    setInitialMessages((prevMessages) => {
      oldMessages = prevMessages;
      return GiftedChat.append(prevMessages, messages);
    });
    createMessageMutation.mutate(
      {
        conversationId: conversationIdLocal!,
        message: messages[0].text,
      },
      {
        onError: () => {
          setInitialMessages(() => GiftedChat.append(oldMessages, []));
        },
      }
    );
  };

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

  if (isError) return <Text>Error fetching messages...</Text>;

  return (
    <GiftedChat
      messages={initialMessages}
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
      renderInputToolbar={(props) => renderInputToolbar(props, colorMode)}
      renderFooter={() => (
        <FootComponent onPressQuickOptions={handleQuickOptions} colorMode={colorMode} />
      )}
      user={{
        _id: 1,
        name: 'ivy',
        avatar: require('../assets/images/user_avatar.png'),
      }}
    />
  );
};

export default ChatContainer;
