import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { XStack, YStack, Button, XStackProps } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { router } from 'expo-router';

type BackButtonProps = XStackProps & {};

const BackButton = ({ ...props }: BackButtonProps) => {
  return (
    <XStack flex={1} justifyContent="flex-start" {...props}>
      <Button
        chromeless
        borderRadius={999}
        onPress={() => router.back()}
        width={'$4'}
        height={'$4'}
        mr={'$10'}
      >
        <ChevronLeft size={'$2'} color={'$grey'} />
      </Button>
    </XStack>
  );
};

export default BackButton;
