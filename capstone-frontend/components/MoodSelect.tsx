import { View, Text } from 'react-native';
import React from 'react';
import MoodPickerOption from '@/components/MoodPickerOption';
import { Avatar, Button, Card, Circle, ScrollView, SizableText, XStack, YStack } from 'tamagui';
import { Calendar, BadgeX } from '@tamagui/lucide-icons';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { router } from 'expo-router';
interface MoodSelectProps {
  handleClose: () => void;
}
const MoodSelect: React.FC<MoodSelectProps> = ({ handleClose }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  return (
    <ScrollView px={'$4'} py={'$20'} backgroundColor={'$white'}>
      <Card elevate size={'$4'} backgroundColor={'$white3'}>
        <Card.Header padded alignSelf="center" pb={'$1'}>
          <SizableText size={'$7'} fontWeight={700} color={'$background'} textAlign="center">
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
          <MoodPickerOption bg={'$green9Light'}>rad</MoodPickerOption>
          <MoodPickerOption bg={'limegreen'}>good</MoodPickerOption>
          <MoodPickerOption bg={'$yellow9Dark'}>meh</MoodPickerOption>
          <MoodPickerOption bg={'orange'}>bad</MoodPickerOption>
          <MoodPickerOption bg={'red'}>awful</MoodPickerOption>
        </XStack>
        <Button
          icon={BadgeX}
          backgroundColor={'$white0'}
          color={'yellowgreen'}
          size={55}
          onPress={() => {
            handleClose();
          }}
        ></Button>
      </Card>
    </ScrollView>
  );
};
export default MoodSelect;
