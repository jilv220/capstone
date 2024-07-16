import React from 'react';
import { ScrollView, XStack } from 'tamagui';
import MoodCounter from '@/components/MoodCounter';
import LineChart from '@/components/ui/LineChart';
import MoodChart from '@/components/MoodChart';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = () => {
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
