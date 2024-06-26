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

  return (
    <View flex={1}>
      <ScrollView px={'$4'} pt={'$10'}>
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
          <Button
            icon={Check}
            backgroundColor={'yellowgreen'}
            color={'white'}
            size={50}
            circular
            onPress={() => {
              const newMoodLog: MoodLogCreate = {
                log_date: dateInScenario as string,
                mood: moodInScenario as Mood,
                scenario: scenarios,
                note: note || undefined,
              };
              createMutation.mutate(newMoodLog);
            }}
          ></Button>
        </YStack>
      </ScrollView>
    </View>
  );
};

export default ScenarioScreen;
