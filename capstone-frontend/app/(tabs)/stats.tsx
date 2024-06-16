import { View, Text } from 'react-native';
import React from 'react';
import { Input, TextArea, YStack, Button } from 'tamagui';
import Counter from '@/components/_TestForIvy/Counter';

const stats = () => {
  return (
    <YStack>
      <Counter></Counter>
    </YStack>
  );
};

export default stats;
