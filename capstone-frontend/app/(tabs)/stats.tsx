import React from 'react';
import { ScrollView, Spinner, XStack, YStack } from 'tamagui';
import MoodCounter from '@/components/MoodCounter';
import LineChart from '@/components/ui/LineChart';
import MoodChart from '@/components/MoodChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getMoodChart, getMoodCount } from '@/actions/moodLog';

const stats = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['mood-log', 'mood-avg'],
        queryFn: getMoodChart,
      },
      {
        queryKey: ['mood-log', 'mood-count'],
        queryFn: getMoodCount,
      },
    ],
  });
  const isPending = queries.some((q) => q.isPending);

  if (isPending) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView pt={'$4'}>
        <MoodChart />
        <MoodCounter />
      </ScrollView>
    </SafeAreaView>
  );
};

export default stats;
