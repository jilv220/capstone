import { View, Text } from 'react-native';
import React from 'react';
import ChatContainer from '@/components/ChatContainer';
import { SizableText, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bold } from '@tamagui/lucide-icons';

const chat = () => {
  return (
    <YStack flex={1}>
      <SafeAreaView>
        <SizableText
          textAlign="center"
          fontSize={'$6'}
          fontFamily={'$heading'}
          fontWeight={'bold'}
          color={'#f90949'}
        >
          AI-Chatbox
        </SizableText>
      </SafeAreaView>
      <ChatContainer />
    </YStack>
  );
};

export default chat;
