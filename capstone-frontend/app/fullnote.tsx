import { View, Text } from 'react-native';
import React from 'react';
import { XStack, YStack, Button, SizableText, Input, TextArea } from 'tamagui';
import { CheckCircle2 } from '@tamagui/lucide-icons';

const fullnote = () => {
  return (
    <YStack flex={1} minHeight={'$10'} py={'$10'} px={'$4'}>
      <TextArea height={'90%'} placeholder="Add note..."></TextArea>
      <Button icon={<CheckCircle2 size={'$3'} color={'yellowgreen'} />}></Button>
    </YStack>
  );
};

export default fullnote;
