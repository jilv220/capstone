import React, { useEffect, useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import {
  SizableText,
  XStack,
  YStack,
  Button,
  YGroup,
  ListItem,
  useTheme,
  ScrollView,
  Input,
  Spinner,
} from 'tamagui';
import { AlignJustify, Edit3 } from '@tamagui/lucide-icons';
import { Modal, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createConversation, getConversations } from '@/actions/chat';
import { Conversation } from '@/interfaces/chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBox } from '@/components/search/SearchBox';

const ChatScreen = () => {
  // useState need to be on top...
  const [openHistory, setOpenHistory] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const queryClient = useQueryClient();
  const {
    data: conversations,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['conversation'],
    queryFn: getConversations,
  });
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const toSorted = (conversations: Conversation[]) =>
    conversations.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

  const filteredConversations =
    conversations && searchQuery
      ? toSorted(conversations).filter((conversation) => {
          return (
            conversation.title &&
            conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
      : [];

  const conversationItems = (source: Conversation[]) =>
    toSorted(source).map((conversation, index) => {
      return (
        <YGroup.Item key={index}>
          <ListItem
            bordered
            hoverTheme
            pressTheme
            title={conversation.title || 'New Conversation'}
            subTitle={new Date(conversation.updated_at).toLocaleDateString()}
            onPress={() => {
              setOpenHistory(false);
              setConversationId(conversation.id);
            }}
          />
        </YGroup.Item>
      );
    });
  useEffect(() => {
    if (conversations && conversations[0]) {
      setConversationId(toSorted(conversations)[0].id);
    }
  }, [conversations]);

  if (isPending)
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  if (isError) return <Text>Error fetching conversations...</Text>;

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    // there'll be a gap underneath the input field if we use SafeAreaView
    <YStack flex={1} pt={'$8'}>
      <XStack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderColor={'$colorHover'}
        borderBottomWidth={1}
        borderLeftWidth={0}
        borderRightWidth={0}
      >
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
          onPress={() => {
            createConversationMutation.mutate(undefined, {
              onSuccess: ({ id }) => {
                setConversationId(id);
              },
            });
          }}
        >
          new
        </Button>
      </XStack>
      <ChatContainer conversationId={conversationId} />

      <Modal
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
            <ScrollView>
              <TouchableOpacity onPress={() => {}}>
                <YGroup bordered pt={'$10'} size="$4">
                  <YGroup.Item>
                    <Input
                      placeholder="Search Conversations..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      marginBottom={'$1'}
                      borderColor={'yellowgreen'}
                      focusStyle={{ borderColor: 'yellowgreen', borderWidth: 3 }}
                    />
                  </YGroup.Item>
                  {searchQuery
                    ? conversationItems(filteredConversations)
                    : conversationItems(conversations)}
                </YGroup>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </YStack>
    // </SafeAreaView>
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
export default ChatScreen;
