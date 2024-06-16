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

const ScenarioScreen: React.FC = () => {
  const router = useRouter();
  const { moodInScenario, dateInScenario } = useLocalSearchParams();

  console.log('params are:');
  console.log(moodInScenario, dateInScenario);

  const [scenarios, setScenarios] = useState<Scenarios>([]);
  const [note, setNote] = useState('');

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

  // useEffect(() => {
  //   console.log(scenarios);
  //   console.log(note);
  // }, [scenarios, note]);

  return (
    <View flex={1}>
      <ScrollView px={'$4'} pt={'$6'}>
        <XStack flex={1} justifyContent="space-between">
          <YStack>
            <Button
              icon={<ChevronLeft size={'$2'} color={'$grey'} />}
              onPress={() => {
                router.back();
              }}
            ></Button>
          </YStack>
          <YStack>
            <Button icon={<ChevronRight size={'$2'} color={'$grey'} />}></Button>
          </YStack>
        </XStack>

        <YStack alignItems="center">
          <SizableText fontWeight={'500'}>What have you been up to?</SizableText>
        </YStack>
        <YStack>
          <ScenariosOptions onOptionClick={setScenarios} />
        </YStack>
        <YStack pb={'$3'}>
          <QuickNote onChangeText={setNote} />
        </YStack>
        <YStack flex={1} ai={'center'}>
          <Button
            icon={Check}
            backgroundColor={'$green9'}
            color={'white'}
            size={50}
            circular
            onPress={() => {
              const newMoodLog: MoodLogCreate = {
                log_date: dateInScenario as string,
                mood: moodInScenario as Mood,
                scenario: scenarios,
                note,
              };
              createMutation.mutate(newMoodLog);
            }}
          ></Button>
          <SizableText size={'$1'} color={'$green9'}>
            Save
          </SizableText>
        </YStack>
      </ScrollView>
    </View>
  );
};

export default ScenarioScreen;
