import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import MoodSelect from './MoodSelect';
import DatePicker from 'react-native-date-picker';
import { ScrollView, Button, SizableText, XStack, YStack, Input } from 'tamagui';
import {
  AlertCircle,
  Angry,
  Calendar,
  Frown,
  Laugh,
  Meh,
  NotebookPen,
  Smile,
} from '@tamagui/lucide-icons';
import MoodPickerOption from './MoodPickerOption';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import ScenariosOptions from './ScenariosOptions';
import QuickNote from './QuickNote';
interface EditRecordProps {
  mood: string;
  digitTime: string;
  moodReason: string;
  year: number;
  month: number;
  date: number;
  id: string;
}
const EditRecord: React.FC<EditRecordProps> = ({
  mood,
  digitTime,
  moodReason,
  year,
  month,
  date,
  id,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [specificDate, setDate] = useState(
    new Date(
      year,
      month,
      date,
      parseInt(digitTime.split(':')[0]),
      parseInt(digitTime.split(':')[1])
    )
  );
  const [emotion, setEmotion] = useState(mood);
  useEffect(() => {}, [emotion]);

  const emotionConfig = [
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

  return (
    <ScrollView>
      <YStack justifyContent="flex-start" flexDirection="column">
        <Button
          size={'$5'}
          backgroundColor={'$white0'}
          icon={<Calendar size={'$1'} />}
          color={'yellowgreen'}
          onPress={() => {
            setDatePickerOpen(true);
          }}
        >
          <SizableText color={'green'} size={'$4'} fontWeight={100} textDecorationLine="underline">
            {specificDate.toDateString() + ' at ' + specificDate.toLocaleTimeString()}
          </SizableText>
        </Button>

        <DatePicker
          modal
          mode="datetime"
          open={datePickerOpen}
          date={specificDate}
          onConfirm={(date) => {
            setDatePickerOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
        <XStack
          px={'$1'}
          justifyContent="space-between"
          py={'$3'}
          borderBlockColor={'grey'}
          borderBottomWidth={'$0.5'}
        >
          {emotionConfig.map((eConfig, index) => {
            return (
              <MoodPickerOption
                key={index}
                bg={(eConfig.mood === emotion && eConfig.bg) || 'grey'}
                Icon={eConfig.Icon}
                onPressHandler={() => {
                  setEmotion(eConfig.mood);
                }}
              >
                {eConfig.mood}
              </MoodPickerOption>
            );
          })}
        </XStack>
        <XStack>
          <ScenariosOptions />
        </XStack>
        <QuickNote bgColor="$white0" />
      </YStack>
    </ScrollView>
  );
};

export default EditRecord;
