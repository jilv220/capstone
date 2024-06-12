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

interface MoodDisplayProps {
  mood: string;
  digitTime: string;
  moodReason: string;
  year: number;
  month: number;
  date: number;
  id: string;
  setSheetOpen: (value: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
const MoodDisplay: React.FC<MoodDisplayProps> = ({
  mood,
  digitTime,
  moodReason,
  year,
  month,
  date,
  id,
  setSheetOpen,
  onDelete,
  onEdit,
}) => {
  const bgColors: { [key: string]: string } = {
    rad: '$green9Light',
    good: 'limegreen',
    meh: 'yellow9Dark',
    bad: 'orange',
    awful: 'red',
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const returnIcon = (mood: string) => {
    switch (mood) {
      case 'rad':
        return Laugh;
        break;
      case 'good':
        return Smile;
        break;
      case 'meh':
        return Meh;
        break;
      case 'bad':
        return Frown;
        break;
      case 'awful':
        return Angry;
        break;
      default:
        return AlertCircle;
    }
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
          <XStack>
            <XStack>
              <Button
                icon={Heart}
                size={'$3'}
                backgroundColor={'$white0'}
                color={'yellowgreen'}
              ></Button>
            </XStack>
            <XStack>
              <SizableText color={'$gray10Light'} py={'$2'}>
                {moodReason}
              </SizableText>
            </XStack>
          </XStack>
        </YStack>
        <YStack flex={1}>
          <Popover size={'$8'} allowFlip placement="bottom" open={popoverOpen}>
            <Popover.Trigger asChild>
              <Button
                icon={PlusCircle}
                backgroundColor={'$white3'}
                size={'$7'}
                color={'gray10Light'}
                justifyContent="center"
                onPress={() => {
                  setPopoverOpen(true);
                }}
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
                <Button
                  icon={Edit3}
                  size={'$5'}
                  borderRadius={0}
                  borderBottomColor={'$gray10Light'}
                  justifyContent="flex-start"
                  onPress={() => {
                    setSheetOpen(true);
                    setPopoverOpen(false);
                    onEdit(id);
                  }}
                >
                  <SizableText fontSize={'$5'}>Edit</SizableText>
                </Button>
                <Button
                  icon={NotebookPen}
                  size={'$5'}
                  borderRadius={0}
                  borderBottomColor={'$gray10Light'}
                  justifyContent="flex-start"
                  onPress={() => {
                    setPopoverOpen(false);
                  }}
                >
                  <SizableText fontSize={'$5'}>Add Note</SizableText>
                </Button>
                <Button
                  icon={Trash2}
                  size={'$5'}
                  borderRadius={0}
                  justifyContent="flex-start"
                  onPress={() => {
                    onDelete(id);
                    setPopoverOpen(false);
                  }}
                >
                  <SizableText fontSize={'$5'}>Delete</SizableText>
                </Button>
              </YStack>
            </Popover.Content>
          </Popover>
        </YStack>
      </XStack>
    </ScrollView>
  );
};

export default MoodDisplay;
