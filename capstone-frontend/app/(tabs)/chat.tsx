import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlignJustify, Bold, Edit3, Plus } from '@tamagui/lucide-icons';
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Modal, TouchableOpacity, StyleSheet, View } from 'react-native';
import { conversation } from '@/interfaces/chat';
import { IMessage } from 'react-native-gifted-chat';

const chat = () => {
  const [openHistory, setOpenHistory] = useState(false);
  const theme = useTheme();
  const initialMessages: IMessage[] = [
    {
      _id: 1,
      text: "hello,I'm Ivy, and I feel a little bit down today.",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Ivy',
        avatar: require('../../assets/images/user_avatar.png'),
      },
    },
  ];
  const saveMessages = (messages: IMessage[]) => {};
  const conversations: conversation[] = [
    {
      id: '1001',
      title: 'I want to talk to you',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    },
    {
      id: '1001',
      title: 'I want to talk to you too',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    },
    {
      id: '1001',
      title: 'I want to talk to you',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    },
    {
      id: '1003',
      title: 'I want to talk to you too',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    },
  ];
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
                  {conversations.map((conversation, index) => {
                    return (
                      <YGroup.Item key={index}>
                        <ListItem
                          bordered
                          hoverTheme
                          pressTheme
                          title={conversation.title}
                          subTitle={new Date(conversation.updated_at).toLocaleDateString()}
                          onPress={() => {
                            setOpenHistory(false);
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
