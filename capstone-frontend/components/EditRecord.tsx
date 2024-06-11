import { View, Text } from 'react-native';
import React, { useState } from 'react';
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
interface EditRecordProps {
  mood: string;
  digitTime: string;
  moodReason: string;
  weekday: number;
  month: number;
  date: number;
  id: string;
}
const EditRecord: React.FC<EditRecordProps> = ({
  mood,
  digitTime,
  moodReason,
  weekday,
  month,
  date,
  id,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [specificDate, setDate] = useState(
    new Date(
      2024,
      month,
      date,
      parseInt(digitTime.split(':')[0]),
      parseInt(digitTime.split(':')[1])
    )
  );
  const setIcon = (mood: string) => {
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
          // backgroundColor={'blue'}
          borderBottomWidth={'$0.5'}
        >
          <MoodPickerOption bg={(mood === 'rad' && '$green9Light') || 'grey'} Icon={setIcon('rad')}>
            rad
          </MoodPickerOption>
          <MoodPickerOption bg={(mood === 'good' && 'limegreen') || 'grey'} Icon={setIcon('good')}>
            good
          </MoodPickerOption>
          <MoodPickerOption bg={(mood === 'meh' && '$yellow9Dark') || 'grey'} Icon={setIcon('meh')}>
            meh
          </MoodPickerOption>
          <MoodPickerOption bg={(mood === 'bad' && 'orange') || 'grey'} Icon={setIcon('bad')}>
            bad
          </MoodPickerOption>
          <MoodPickerOption bg={(mood === 'awful' && 'red') || 'grey'} Icon={setIcon('awful')}>
            awful
          </MoodPickerOption>
        </XStack>
        <XStack>
          <ScenariosOptions />
        </XStack>
        <XStack py="$3" justifyContent="space-between" flexDirection="row">
          <Button
            icon={<NotebookPen size={'$1'} />}
            backgroundColor={'white'}
            color={'yellowgreen'}
          >
            <SizableText>Quick Note</SizableText>
          </Button>
          <Button backgroundColor={'white'}>
            <SizableText color={'green'}>Open Full Note</SizableText>
          </Button>
        </XStack>
        <XStack>
          <Input size={'$4'} placeholder="Add Note..." flex={1}></Input>
        </XStack>
      </YStack>
    </ScrollView>
  );
};

export default EditRecord;
