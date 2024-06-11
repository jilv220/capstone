import { View, Text } from 'react-native';
import React, { useState } from 'react';
import MoodSelect from './MoodSelect';
import DatePicker from 'react-native-date-picker';
import { ScrollView, Button, SizableText, XStack } from 'tamagui';
import { Calendar } from '@tamagui/lucide-icons';
import MoodPickerOption from './MoodPickerOption';
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
  return (
    <ScrollView>
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
      <XStack px={'$4'} justifyContent="space-between" py={'$3'}>
        <MoodPickerOption bg={(mood === 'rad' && '$green9Light') || 'grey'}>rad</MoodPickerOption>
        <MoodPickerOption bg={(mood === 'good' && 'limegreen') || 'grey'}>good</MoodPickerOption>
        <MoodPickerOption bg={(mood === 'meh' && '$yellow9Dark') || 'grey'}>meh</MoodPickerOption>
        <MoodPickerOption bg={(mood === 'bad' && 'orange') || 'grey'}>bad</MoodPickerOption>
        <MoodPickerOption bg={(mood === 'awful' && 'red') || 'grey'}>awful</MoodPickerOption>
      </XStack>
    </ScrollView>
  );
};

export default EditRecord;
