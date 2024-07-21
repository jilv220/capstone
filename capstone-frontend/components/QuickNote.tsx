import { View, Text } from 'react-native';
import { XStack, YStack, Button, SizableText, Input, Sheet, TextArea } from 'tamagui';
import { NotebookPen } from '@tamagui/lucide-icons';
import { ReactSetStateType } from '@/interfaces/base';
import { router, useLocalSearchParams } from 'expo-router';
import fullnote from '../app/fullnote';
import React from 'react';

interface QuickNoteProps {
  bgColor?: string;
  note?: string | null;
  onChangeText: ReactSetStateType<string | undefined>;
}
const QuickNote: React.FC<QuickNoteProps> = ({ bgColor, onChangeText, note }) => {
  const [isTextArea, changeToTextArea] = React.useState(false);
  return (
    <YStack>
      <XStack py="$3" justifyContent="space-between" flexDirection="row">
        <Button
          icon={<NotebookPen size={'$1'} />}
          backgroundColor={bgColor || '$background'}
          color={'#f9476c'}
        >
          <SizableText>Quick Note</SizableText>
        </Button>
        <Button
          backgroundColor={bgColor || '$background'}
          onPress={() => {
            changeToTextArea(!isTextArea);
          }}
        >
          <SizableText color={'#F9476C'}>Open Full Note</SizableText>
        </Button>
      </XStack>
      <XStack>
        {isTextArea ? (
          <TextArea
            flex={1}
            minHeight={'$15'}
            placeholder="Add note..."
            onChangeText={onChangeText}
          >
            {note || ''}
          </TextArea>
        ) : (
          <Input
            size={'$4'}
            placeholder="Add Note..."
            flex={1}
            onChangeText={(newText) => {
              onChangeText(newText);
            }}
          >
            {note || ''}
          </Input>
        )}
      </XStack>
    </YStack>
  );
};

export default QuickNote;
