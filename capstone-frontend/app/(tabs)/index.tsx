import { Text } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ScrollView, Sheet, XStack, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getMoodLogs } from '@/actions/user';
import { LegacyMoodData } from '@/interfaces/moodLog';

import MoodDisplay from '@/components/MoodDisplay';
import EditRecord from '@/components/EditRecord';

export default function HomeScreen() {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [moodTestData, setData] = useState<LegacyMoodData[]>([]);
  const [editData, setEditData] = useState<LegacyMoodData | null>(null);

  const { data, error } = useQuery({ queryKey: ['mood-log'], queryFn: getMoodLogs });
  if (error)
    return (
      <YStack>
        <Text>Error fetching mood log data</Text>
      </YStack>
    );

  const testData = data?.map((log) => {
    const logDate = new Date(log['log_date']);
    const minutes =
      logDate.getMinutes().toString().length === 1
        ? '0' + logDate.getMinutes()
        : logDate.getMinutes();
    const hour =
      logDate.getHours().toString().length === 1 ? '0' + logDate.getHours() : logDate.getHours();
    const moodData = {
      mood: log['mood'],
      digitTime: hour + ':' + minutes,
      moodReason: 'wait for update',
      date: logDate.getDate(),
      month: logDate.getMonth(),
      year: logDate.getFullYear(),
      id: log['id'],
    };
    return moodData;
  });

  const handleDelete = (dataId: string) => {
    const newData = moodTestData.filter((item) => item.id !== dataId);
    setData(newData);
  };

  useEffect(() => {}, [editData]);

  const handleEdit = (dataId: string) => {
    const newData = moodTestData.find((item) => item.id === dataId);
    if (newData != undefined) setEditData(newData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <XStack h={'$9'}></XStack>
        {testData &&
          testData.map((moodData) => {
            return (
              <MoodDisplay
                key={moodData.id}
                id={moodData.id}
                mood={moodData.mood}
                year={moodData.year}
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
              {editData && (
                <EditRecord
                  key={editData.id}
                  id={editData.id}
                  mood={editData.mood}
                  year={editData.year}
                  date={editData.date}
                  month={editData.month}
                  digitTime={editData.digitTime}
                  moodReason={editData.moodReason}
                />
              )}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </SafeAreaView>
  );
}
