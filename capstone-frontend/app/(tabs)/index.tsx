import { View, Text } from 'react-native';
import React from 'react';
import MoodDisplay from '@/components/MoodDisplay';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { ScrollView } from 'tamagui';

export default function HomeScreen() {
  const d2 = {
    mood: 'good',
    digitTime: '18:11',
    moodReason: 'date',
    weekday: 2,
    month: 5,
    date: 5,
  };
  const data = [
    {
      mood: 'good',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 5,
      date: 5,
    },
    {
      mood: 'bad',
      digitTime: '19:11',
      moodReason: 'food',
      weekday: 5,
      month: 5,
      date: 2,
    },
    {
      mood: 'mad',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 5,
      date: 5,
    },
    {
      mood: 'not bad',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 5,
      date: 5,
    },
  ];
  return (
    <ScrollView maxHeight={800} py={'$20'}>
      {data.map((moodData, index) => {
        return (
          <MoodDisplay
            key={index}
            mood={moodData.mood}
            weekday={moodData.weekday}
            date={moodData.date}
            month={moodData.month}
            digitTime={moodData.digitTime}
            moodReason={moodData.moodReason}
          />
        );
      })}
    </ScrollView>
  );
}
