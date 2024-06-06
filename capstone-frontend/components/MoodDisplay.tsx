import { View, Text } from 'react-native';
import React from 'react';
import MoodPickerOption from '@/components/MoodPickerOption';
import {
  Avatar,
  Button,
  Card,
  Circle,
  Label,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from 'tamagui';
import { Calendar, X, Music4, Heart, BadgeCheck } from '@tamagui/lucide-icons';
import { useState } from 'react';

interface MoodDisplayProps {
  mood: string;
  digitTime: string;
  moodReason: string;
  weekday: number;
  month: number;
  date: number;
}
const MoodDisplay: React.FC<MoodDisplayProps> = ({
  mood,
  digitTime,
  moodReason,
  weekday,
  month,
  date,
}) => {
  const dateToWeekday: { [key: number]: string } = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  const dateToMonth: { [key: number]: string } = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };
  let convertedWeekday = dateToWeekday[weekday];
  let convertedMonth = dateToMonth[month];

  return (
    <ScrollView px={'$4'} py={'$4'} backgroundColor={'$white'}>
      <XStack elevation={2} backgroundColor={'$white3'} borderRadius={4}>
        <YStack flex={1}>
          <Card size={'$4'} backgroundColor={'$white3'} padded>
            <Card.Header padded alignSelf="center" pb={'$1'}></Card.Header>
            <MoodPickerOption bg={'$green9Light'}>{mood}</MoodPickerOption>
          </Card>
        </YStack>
        <YStack flex={2}>
          <XStack px={'$2'} py={'$4'}>
            <SizableText color={'$gray10Light'} fontWeight={300} fontFamily={'$mono'}>
              {convertedWeekday} {convertedMonth} {date}
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
          <Button
            icon={BadgeCheck}
            size={'$8'}
            backgroundColor={'$white0'}
            color={'gray10Light'}
            marginTop={'$-3'}
          ></Button>
        </YStack>
      </XStack>
    </ScrollView>
  );
};

export default MoodDisplay;