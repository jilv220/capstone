import React, { useEffect } from 'react';
import { Button, Card, ScrollView, SizableText, XStack } from 'tamagui';
import { Calendar, ArrowRightCircle } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { buildMoodOptions } from '@/lib/mood';

import MoodPickerOption from '@/components/MoodPickerOption';
import DatePicker from 'react-native-date-picker';

interface MoodSelectProps {
  handleClose: () => void;
}
const MoodSelect: React.FC<MoodSelectProps> = ({ handleClose }) => {
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState('rad');
  const [open, setOpen] = useState(false);
  const moodOptions = buildMoodOptions();

  const onMoodSelect = (mood: string) => {
    setMood(mood);
  };
  const onMoodSelectHandler = (mood: string) => {
    onMoodSelect(mood);
  };
  useEffect(() => {}, [mood]);
  return (
    <ScrollView px={'$4'}>
      <Card elevate size={'$4'}>
        <Card.Header padded alignSelf="center" pb={'$1'}>
          <SizableText size={'$7'} fontWeight={700} textAlign="center">
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
                Icon={option.icon}
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
