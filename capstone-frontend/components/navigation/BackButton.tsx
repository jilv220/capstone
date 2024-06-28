import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { XStack, YStack, Button } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { router } from 'expo-router';

const BackButton = () => {
  return (
    <XStack flex={1} justifyContent="flex-start">
      <YStack py={'$2'} flex={1}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={'$2'} color={'$grey'} />
        </TouchableOpacity>
      </YStack>
    </XStack>
  );
};

export default BackButton;
