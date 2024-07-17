import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import MoodSelect from './MoodSelect';
import DatePicker from 'react-native-date-picker';
import { ScrollView, Button, SizableText, XStack, YStack, Input, useTheme } from 'tamagui';
import {
  AlertCircle,
  Angry,
  ArrowRightCircle,
  Calendar,
  ChevronRightCircle,
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
import { router } from 'expo-router';
import { Scenarios } from '@/interfaces/scenario';
import { Mood } from '@/interfaces/moodLog';
import { LucideIcon } from '@/interfaces/base';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoodLog } from '@/actions/user';
interface EditRecordProps {
  id: string;
  log_date: string;
  mood: Mood;
  note?: string | null;
  user_id: string;
  scenario: Scenarios;
  handlePreceding: () => void;
}
interface EmotionConfig {
  mood: Mood;
  bg: string;
  Icon: LucideIcon;
}
const EditRecord: React.FC<EditRecordProps> = ({
  mood,
  log_date,
  note,
  user_id,
  scenario,
  id,
  handlePreceding,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [specificDate, setDate] = useState(new Date(log_date));
  const [emotion, setEmotion] = useState<'awful' | 'bad' | 'good' | 'meh' | 'rad'>(mood);
  const [modifiedScenario, setModifiedScenario] = useState<Scenarios>(scenario);
  const [modifiedNote, setModifiedNote] = useState<string | null>(note || null);
  useEffect(() => {}, [emotion]);
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-log'] });
      router.push('/');
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const emotionConfig: EmotionConfig[] = [
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
      <YStack flex={1}>
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
          px={'$3'}
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
        <YStack>
          <ScenariosOptions
            onOptionClick={setModifiedScenario}
            currentScenarios={modifiedScenario}
          />
        </YStack>
        <YStack>
          <QuickNote bgColor="$white0" onChangeText={setModifiedNote} note={note} />
        </YStack>
        <YStack py={'$3'}>
          <Button
            backgroundColor={'$white0'}
            icon={
              <ArrowRightCircle
                size={'$3'}
                color={'yellowgreen'}
                disabled={modifiedScenario.length === 0}
                disabledStyle={{
                  color: '$dimYellowgreen',
                }}
              />
            }
            disabled={modifiedScenario.length === 0}
            onPress={() => {
              const updatedMoodLog = {
                id: id,
                mood: emotion,
                log_date: specificDate.toISOString(),
                note: modifiedNote,
                scenario: modifiedScenario,
              };
              console.log(updatedMoodLog);
              updateMutation.mutate(updatedMoodLog);
              router.push('/');
              handlePreceding();
            }}
          ></Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default EditRecord;
