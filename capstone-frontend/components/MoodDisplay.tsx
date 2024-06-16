import { View, Text } from 'react-native';
import React from 'react';
import MoodPickerOption from '@/components/MoodPickerOption';

import {
  Avatar,
  Button,
  Card,
  Circle,
  Label,
  Popover,
  ScrollView,
  Sheet,
  SizableText,
  XStack,
  YStack,
} from 'tamagui';
import {
  Calendar,
  X,
  Music4,
  Heart,
  PlusCircle,
  Edit3,
  Trash2,
  NotebookPen,
  ChevronDown,
  Laugh,
  Smile,
  Meh,
  Annoyed,
  Angry,
  AlertCircle,
  Frown,
} from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoodLog } from '@/actions/user';
import { categories } from '@/interfaces/categories';
import { Scenario, Scenarios } from '@/interfaces/scenario';

interface MoodDisplayProps {
  mood: string;
  digitTime: string;
  scenarios: Scenarios;
  year: number;
  month: number;
  date: number;
  id: string;
  setSheetOpen: (value: boolean) => void;
  onEdit: (id: string) => void;
}
const MoodDisplay: React.FC<MoodDisplayProps> = ({
  mood,
  digitTime,
  scenarios,
  year,
  month,
  date,
  id,
  setSheetOpen,
  onEdit,
}) => {
  const bgColors: { [key: string]: string } = {
    rad: '$green9Light',
    good: 'limegreen',
    meh: '$yellow9Dark',
    bad: 'orange',
    awful: 'red',
  };

  const returnIcon = (mood: string) => {
    switch (mood) {
      case 'rad':
        return Laugh;
      case 'good':
        return Smile;
      case 'meh':
        return Meh;
      case 'bad':
        return Frown;
      case 'awful':
        return Angry;
      default:
        return AlertCircle;
    }
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-log'] });
    },
  });

  const getCategory = (category: Scenario) => {
    const categoryData = categories.find((item) => item.key === category);
    return categoryData;
  };
  return (
    <ScrollView px={'$4'} py={'$4'} backgroundColor={'$white'}>
      <XStack elevation={2} backgroundColor={'$white3'} borderRadius={4}>
        <YStack flex={1}>
          <Card size={'$4'} backgroundColor={'$white3'} padded>
            <Card.Header padded alignSelf="center" pb={'$1'}></Card.Header>
            <MoodPickerOption Icon={returnIcon(mood)} bg={bgColors[mood]}>
              {mood}
            </MoodPickerOption>
          </Card>
        </YStack>
        <YStack flex={2}>
          <XStack px={'$2'} py={'$4'}>
            <SizableText color={'$gray10Light'} fontWeight={300} fontFamily={'$mono'}>
              {new Date(
                year,
                month,
                date,
                parseInt(digitTime.split(':')[0]),
                parseInt(digitTime.split(':')[1])
              ).toDateString()}
            </SizableText>
          </XStack>
          <XStack px={'$2'} marginTop={'$-2'}>
            <SizableText color={'yellowgreen'} fontWeight={700} fontSize={25}>
              {mood}
            </SizableText>
            <SizableText color={'$gray10Light'} px={'$2'}>
              {digitTime}
            </SizableText>
          </XStack>
          <XStack flexWrap="wrap">
            {scenarios.map((scenario: Scenario) => {
              const category = getCategory(scenario);
              return (
                <XStack key={category?.key}>
                  <YStack>
                    <Button
                      icon={category?.icon}
                      size={'$3'}
                      backgroundColor={'$white0'}
                      color={'yellowgreen'}
                    />
                  </YStack>
                  <YStack>
                    <SizableText color={'$gray10Light'} py={'$2'} fontSize={'$1'}>
                      {category?.text}
                    </SizableText>
                  </YStack>
                </XStack>
              );
            })}
          </XStack>
        </YStack>
        <YStack flex={1}>
          <Popover size={'$8'} allowFlip placement="bottom">
            <Popover.Trigger asChild>
              <Button
                icon={PlusCircle}
                backgroundColor={'$white3'}
                size={'$7'}
                color={'gray10Light'}
                justifyContent="center"
              ></Button>
            </Popover.Trigger>
            <Popover.Content
              size={'$8'}
              flex={1}
              borderColor="$gray10Light"
              borderWidth={1}
              padding={0}
              elevate
              borderRadius={0}
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              animation={[
                'quick',
                {
                  opactiy: {
                    overshoot: {
                      overshootClamping: true,
                    },
                  },
                },
              ]}
            >
              <YStack flex={1}>
                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={Edit3}
                    size={'$5'}
                    borderRadius={0}
                    borderBottomColor={'$gray10Light'}
                    justifyContent="flex-start"
                    onPress={() => {
                      setSheetOpen(true);
                      onEdit(id);
                    }}
                  >
                    <SizableText fontSize={'$5'}>Edit</SizableText>
                  </Button>
                </Popover.Close>

                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={NotebookPen}
                    size={'$5'}
                    borderRadius={0}
                    borderBottomColor={'$gray10Light'}
                    justifyContent="flex-start"
                    onPress={() => {}}
                  >
                    <SizableText fontSize={'$5'}>Add Note</SizableText>
                  </Button>
                </Popover.Close>

                <Popover.Close asChild fd={'row'}>
                  <Button
                    icon={Trash2}
                    size={'$5'}
                    borderRadius={0}
                    justifyContent="flex-start"
                    onPress={() => {
                      deleteMutation.mutate(id);
                    }}
                  >
                    <SizableText fontSize={'$5'}>Delete</SizableText>
                  </Button>
                </Popover.Close>
              </YStack>
            </Popover.Content>
          </Popover>
        </YStack>
      </XStack>
    </ScrollView>
  );
};

export default MoodDisplay;
