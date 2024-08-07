import { Check, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, ScrollView, SizableText, View, XStack, YStack } from 'tamagui';

import QuickNote from '@/components/QuickNote';
import ScenariosOptions from '@/components/ScenariosOptions';
import { Mood, MoodLogCreate } from '@/interfaces/moodLog';
import { useState } from 'react';
import { Scenarios } from '@/interfaces/scenario';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoodLog } from '@/actions/user';
import BackButton from '@/components/navigation/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import SaveBtn from '@/components/SaveBtn';

const ScenarioScreen: React.FC = () => {
  const router = useRouter();

  const { moodInScenario, dateInScenario } = useLocalSearchParams();
  const [scenarios, setScenarios] = useState<Scenarios>([]);
  const [note, setNote] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-log'] });
      router.push('/');
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const isSaveBtnDisabled = scenarios.length === 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
        <ScrollView px={'$4'} pt={'$4'}>
          <BackButton />
          <YStack alignItems="center">
            <SizableText fontWeight={'bold'}>What have you been up to?</SizableText>
          </YStack>
          <YStack>
            <ScenariosOptions onOptionClick={setScenarios} />
          </YStack>
          <YStack pb={'$3'}>
            <QuickNote onChangeText={setNote} note={note || ''} />
          </YStack>
          <YStack flex={1} ai={'center'}>
            <SaveBtn
              disabled={isSaveBtnDisabled}
              onSaveBtnPressed={() => {
                const newMoodLog: MoodLogCreate = {
                  log_date: dateInScenario as string,
                  mood: moodInScenario as Mood,
                  scenario: scenarios,
                  note: note || undefined,
                };
                createMutation.mutate(newMoodLog);
              }}
            />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScenarioScreen;
