import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import MoodPickerOption from '@/components/MoodPickerOption';
import { Avatar, Button, Card, Circle, ScrollView, SizableText, XStack, YStack } from 'tamagui';
import {
  Calendar,
  Laugh,
  Meh,
  Smile,
  Annoyed,
  Angry,
  Frown,
  ArrowRightCircle,
} from '@tamagui/lucide-icons';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { router, useNavigation } from 'expo-router';
interface MoodSelectProps {
  handleClose: () => void;
}
const MoodSelect: React.FC<MoodSelectProps> = ({ handleClose }) => {
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState('rad');
  const [open, setOpen] = useState(false);
  const moodOptions = [
    {
      mood: 'rad',
      bg: '$green9Light',
      Icon: Laugh,
    },
    {
      mood: 'good',
      bg: 'limegreen',
      Icon: Smile,
    },
    {
      mood: 'meh',
      bg: '$yellow9Dark',
      Icon: Meh,
    },
    {
      mood: 'bad',
      bg: 'orange',
      Icon: Frown,
    },
    {
      mood: 'awful',
      bg: 'red',
      Icon: Angry,
    },
  ];

  const onMoodSelect = (mood: string) => {
    setMood(mood);
  };
  const onMoodSelectHandler = (mood: string) => {
    onMoodSelect(mood);
    // handleClose();
    // router.push({
    //   pathname: '/scenario',
    //   params: { moodInScenario: mood, dateInScenario: date.toISOString() },
    // });
  };
  useEffect(() => {}, [mood]);
  return (
    <ScrollView px={'$4'} backgroundColor={'$white'}>
      <Card elevate size={'$4'} backgroundColor={'$white3'}>
        <Card.Header padded alignSelf="center" pb={'$1'}>
          <SizableText size={'$7'} fontWeight={700} color={'$black5'} textAlign="center">
            How are you?
          </SizableText>
          <Button
            backgroundColor={'$white0'}
            color={'$green10Dark'}
            icon={<Calendar size="24" />}
            onPress={() => {
              setOpen(true);
            }}
          >
            {date.toLocaleString()}
          </Button>
          <DatePicker
            modal
            mode="datetime"
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </Card.Header>
        <XStack px={'$4'} justifyContent="space-between" py={'$3'}>
          {moodOptions.map((option, index) => {
            return (
              <MoodPickerOption
                key={index}
                bg={(option.mood === mood && option.bg) || 'grey'}
                Icon={option.Icon}
                onPressHandler={() => {
                  onMoodSelectHandler(option.mood);
                }}
              ></MoodPickerOption>
            );
          })}
        </XStack>
        <Button
          icon={ArrowRightCircle}
          backgroundColor={'$white0'}
          color={'yellowgreen'}
          size={55}
          onPress={() => {
            handleClose();
            router.push({
              pathname: '/scenario',
              params: { moodInScenario: mood, dateInScenario: date.toISOString() },
            });
          }}
        ></Button>
      </Card>
    </ScrollView>
  );
};
export default MoodSelect;
