import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import MoodDisplay from '@/components/MoodDisplay';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { ScrollView, Sheet, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from '@tamagui/lucide-icons';
import EditRecord from '@/components/EditRecord';
import { useLocalSearchParams } from 'expo-router';
import Storage from '@/lib/storage.native';
interface MoodData {
  mood: string;
  digitTime: string;
  moodReason: string;
  year: number;
  month: number;
  date: number;
  id: string;
}
export default function HomeScreen() {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [moodTestData, setData] = useState<MoodData[]>([]);
  const [editData, setEditData] = useState<MoodData | null>(null);
  useEffect(() => {
    const fetchSessionToken = async () => {
      const token = await Storage.getItem('session_token');
      if (token) setSessionToken(token);
    };
    fetchSessionToken();
  }, []);

  const getMoodLog = async (token: any) => {
    const url = 'https://api.capstone.lyuji.dev/api/v1/user/mood-log';
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const data: MoodData[] = [];
        responseJson.forEach((item: any) => {
          const logDate = new Date(item['log_date']);
          const minutes =
            logDate.getMinutes().toString().length === 1
              ? '0' + logDate.getMinutes()
              : logDate.getMinutes();
          const hour =
            logDate.getHours().toString().length === 1
              ? '0' + logDate.getHours()
              : logDate.getHours();
          const moodData = {
            mood: item['mood'],
            digitTime: hour + ':' + minutes,
            moodReason: 'wait for update',
            date: logDate.getDate(),
            month: logDate.getMonth(),
            year: logDate.getFullYear(),
            id: item['id'],
          };
          // console.log(moodData);
          data.push(moodData);
        });
        // console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (sessionToken) {
      getMoodLog(sessionToken);
    }
  }, [sessionToken]);

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
        {moodTestData.map((moodData, index) => {
          return (
            <MoodDisplay
              key={index}
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
