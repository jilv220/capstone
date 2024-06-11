import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import MoodDisplay from '@/components/MoodDisplay';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { ScrollView, Sheet, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from '@tamagui/lucide-icons';
import EditRecord from '@/components/EditRecord';

export default function HomeScreen() {
  const [position, setPosition] = useState(0);

  const [open, setOpen] = useState(false);

  const data = [
    {
      mood: 'good',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 5,
      date: 5,
      id: '1',
    },
    {
      mood: 'bad',
      digitTime: '19:11',
      moodReason: 'food',
      weekday: 5,
      month: 4,
      date: 2,
      id: '2',
    },
    {
      mood: 'awful',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 3,
      date: 5,
      id: '3',
    },
    {
      mood: 'rad',
      digitTime: '18:11',
      moodReason: 'date',
      weekday: 2,
      month: 2,
      date: 5,
      id: '4',
    },
  ];
  const [moodTestData, setData] = useState(data);
  const handleDelete = (dataId: string) => {
    const newData = moodTestData.filter((item) => item.id !== dataId);
    setData(newData);
  };
  const [editData, setEditData] = useState(moodTestData[0]);

  useEffect(() => {}, [editData]);

  const handleEdit = (dataId: string) => {
    const newData = moodTestData.find((item) => item.id === dataId);
    if (newData != undefined) setEditData(newData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <XStack h={'$11'}></XStack>
        {moodTestData.map((moodData, index) => {
          return (
            <MoodDisplay
              key={index}
              id={moodData.id}
              mood={moodData.mood}
              weekday={moodData.weekday}
              date={moodData.date}
              month={moodData.month}
              digitTime={moodData.digitTime}
              moodReason={moodData.moodReason}
              setSheetOpen={setOpen}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          );
        })}
        <Sheet
          forceRemoveScrollEnabled={open}
          open={open}
          onOpenChange={setOpen}
          dismissOnSnapToBottom
          position={position}
          onPositionChange={setPosition}
          zIndex={100_000}
          animation="medium"
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

          <Sheet.Handle />

          <Sheet.Frame alignItems="center">
            <YStack py={'$4'} width={'90%'} justifyContent="space-evenly">
              <EditRecord
                key={editData.id}
                id={editData.id}
                mood={editData.mood}
                weekday={editData.weekday}
                date={editData.date}
                month={editData.month}
                digitTime={editData.digitTime}
                moodReason={editData.moodReason}
              />
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </SafeAreaView>
  );
}
