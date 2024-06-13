import { View, Text } from 'react-native';
import { XStack, YStack, Button, SizableText, Input } from 'tamagui';
import { NotebookPen } from '@tamagui/lucide-icons';
import { ReactSetStateType } from '@/interfaces/base';
import { router } from 'expo-router';

import React from 'react';
import fullnote from '@/app/fullnote';
  
interface QuickNoteProps {
  bgColor?: string;
  onChangeText: ReactSetStateType<string>;
}
const QuickNote: React.FC<QuickNoteProps> = ({ bgColor, onChangeText }) => {
  return (
    <YStack>
      <XStack py="$3" justifyContent="space-between" flexDirection="row">
        <Button
          icon={<NotebookPen size={'$1'} />}
          backgroundColor={bgColor || '$background'}
          color={'yellowgreen'}
        >
          <SizableText>Quick Note</SizableText>
        </Button>
        <Button
          backgroundColor={bgColor || '$background'}
          onPress={() => {
            router.push('/fullnote');
          }}
        >
          <SizableText color={'green'}>Open Full Note</SizableText>
        </Button>
      </XStack>
      <XStack>
        <Input
          size={'$4'}
          placeholder="Add Note..."
          flex={1}
          onChangeText={(newText) => {
            onChangeText(newText);
          }}
        ></Input>
      </XStack>
    </YStack>
  );
};

export default QuickNote;
