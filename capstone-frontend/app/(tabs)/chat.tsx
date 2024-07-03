import React, { useEffect, useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import {
  SizableText,
  XStack,
  YStack,
  Button,
  Sheet,
  YGroup,
  ListItem,
  useTheme,
  Separator,
} from 'tamagui';
import { AlignJustify, Bold, Edit3, Plus } from '@tamagui/lucide-icons';
import { Modal, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { conversation } from '@/interfaces/chat';
import { IMessage } from 'react-native-gifted-chat';
import { useQuery } from '@tanstack/react-query';
import {
  convertConversation,
  createConversation,
  getAllMessages,
  getConversation,
} from '@/actions/chat';

const chat = () => {
  //get conversation, if there's no conversation, create a new one
  //if there's a conversation, get messages from the first conversation
  const [selectedConversation, setSelectedConversation] = useState<conversation | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [createConversationFlag, setCreateConversationFlag] = useState(false);

  const {
    data: conversations,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['conversation'],
    queryFn: getConversation,
  });
  // if there's conversation, set the first conversation as selected conversation
  // if there's no conversation, create a new conversation
  useEffect(() => {
    if (conversations) {
      setSelectedConversation(conversations[0]);
      setSelectedConversationId(conversations[0].id);
    } else {
      setCreateConversationFlag(true);
    }
  }, [conversations]);

  //create a new conversation if there's no conversation

  useEffect(() => {
    if (createConversationFlag) {
      const createNewConversation = async () => {
        try {
          const newConversation = await createConversation();
          setSelectedConversation(newConversation);
          setSelectedConversationId(newConversation.id);
          setCreateConversationFlag(false);
        } catch (err) {
          console.log('error to create new conversation', err);
        }
        createNewConversation();
      };
    }
  }, [createConversationFlag]);

  //get messages from conversation
  const [initialMessages, setInitialMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (selectedConversationId) {
          const allMessages = await getAllMessages(selectedConversationId);
          setInitialMessages(convertConversation(allMessages));
        }
      } catch (err) {
        console.log('error to get messages', err);
      }
    };
    getMessages();
  }, [selectedConversationId]);

  const [openHistory, setOpenHistory] = useState(false);
  const theme = useTheme();

  const saveMessages = (messages: IMessage[]) => {};

  useEffect(() => {
    console.log('initailmessage', initialMessages);
  }, [initialMessages]);
  useEffect(() => {
    console.log('selectedConversationId', selectedConversationId);
  }, [selectedConversationId]);

  if (isPending) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching conversation data</Text>;

  return (
    <YStack flex={1}>
      <XStack flexDirection="row" justifyContent="space-between" alignItems="center" pt={'$8'}>
        <Button
          backgroundColor={'$colorTransparent'}
          icon={AlignJustify}
          onPress={() => {
            setOpenHistory(true);
          }}
        >
          history
        </Button>
        <SizableText
          textAlign="center"
          fontSize={'$2'}
          fontFamily={'$heading'}
          fontWeight={'bold'}
          color={'#f90949'}
        >
          AI-Chatbox
        </SizableText>
        <Button
          icon={Edit3}
          backgroundColor={'$colorTransparent'}
          color={initialMessages.length > 0 ? theme.color : 'gray'}
          onPress={() => {}}
        >
          new
        </Button>
      </XStack>
      <ChatContainer initialMessages={initialMessages} saveMessages={saveMessages} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={openHistory}
        onRequestClose={() => {
          setOpenHistory(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => {
            setOpenHistory(false);
          }}
        >
          <View
            style={theme.background.val === '#050505' ? styles.sideBarGray : styles.sideBarWhite}
          >
            <View>
              <TouchableOpacity onPress={() => {}}>
                <YGroup bordered pt={'$10'} size="$4">
                  {conversations?.map((conversation, index) => {
                    return (
                      <YGroup.Item key={index}>
                        <ListItem
                          bordered
                          hoverTheme
                          pressTheme
                          title={conversation.title || 'new Conversation'}
                          subTitle={new Date(conversation.updated_at).toLocaleDateString()}
                          onPress={() => {
                            setOpenHistory(false);
                            setSelectedConversation(conversation);
                            // console.log('conversation', conversation);
                          }}
                        />
                      </YGroup.Item>
                    );
                  })}
                </YGroup>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </YStack>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sideBarWhite: {
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
  },
  sideBarGray: {
    width: '80%',
    height: '100%',
    backgroundColor: 'gray',
  },
});
export default chat;
