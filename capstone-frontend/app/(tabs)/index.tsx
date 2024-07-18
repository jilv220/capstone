import { ImageBackground, KeyboardAvoidingView, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ScrollView, Sheet, Spinner, XStack, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getMoodLogs } from '@/actions/user';
import { LegacyMoodData, MoodLog } from '@/interfaces/moodLog';

import MoodDisplay from '@/components/MoodDisplay';
import EditRecord from '@/components/EditRecord';
import { usePrefetchAllScreens } from '@/hooks/usePrefetchAllScreens';

export default function HomeScreen() {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<MoodLog | null>(null);
  const [editKey, setEditKey] = useState(Date.now());
  const { data, isPending, isError } = useQuery({
    queryKey: ['mood-log'],
    queryFn: getMoodLogs,
  });

  usePrefetchAllScreens();

  if (isPending) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack>
        <Text>Error fetching mood log data</Text>
      </YStack>
    );
  }

  const convertDataToLegacyData = (log: MoodLog) => {
    const logDate = new Date(log['log_date']);
    const minutes =
      logDate.getMinutes().toString().length === 1
        ? '0' + logDate.getMinutes()
        : logDate.getMinutes();
    const hour =
      logDate.getHours().toString().length === 1 ? '0' + logDate.getHours() : logDate.getHours();
    const legacyData = {
      mood: log['mood'],
      digitTime: hour + ':' + minutes,
      scenarios: log['scenario'],
      date: logDate.getDate(),
      month: logDate.getMonth(),
      year: logDate.getFullYear(),
      note: log.note,
      id: log['id'],
    };

    return legacyData;
  };

  const sortedData = data.sort((a, b) => (a.log_date < b.log_date ? 1 : -1));
  const moodTestData = sortedData.map((log) => {
    return convertDataToLegacyData(log);
  });

  const handleEdit = (dataId: string) => {
    setEditKey(Date.now());
    const newData = data.find((item) => item.id === dataId);
    if (newData != undefined) {
      setEditData(newData);
    }
  };

  const displayWhenNoData = () => {
    return (
      <YStack>
        <Text>No data to display</Text>
      </YStack>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {moodTestData.map((moodData, index) => {
          return (
            <MoodDisplay
              key={editKey + index}
              id={moodData.id}
              mood={moodData.mood}
              year={moodData.year}
              date={moodData.date}
              month={moodData.month}
              digitTime={moodData.digitTime}
              scenarios={moodData.scenarios}
              note={moodData.note || ''}
              setSheetOpen={setOpen}
              onEdit={handleEdit}
            />
          );
        })}
        <Sheet
          open={open}
          onOpenChange={() => {
            setOpen(false);
            setEditKey(Date.now());
          }}
          position={position}
          onPositionChange={setPosition}
          zIndex={100_000}
          snapPoints={[92, 100]}
          animation="medium"
          modal
          dismissOnSnapToBottom
          forceRemoveScrollEnabled
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

          <Sheet.Handle />

          <Sheet.Frame px="$2.5" flex={1}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior="position"
              keyboardVerticalOffset={40}
            >
              {editData && (
                <EditRecord
                  key={editKey}
                  id={editData.id}
                  mood={editData.mood}
                  user_id={editData.user_id}
                  note={editData.note}
                  log_date={editData.log_date}
                  scenario={editData.scenario}
                  handlePreceding={() => {
                    setOpen(false);
                  }}
                />
              )}
            </KeyboardAvoidingView>
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </SafeAreaView>
  );
}
