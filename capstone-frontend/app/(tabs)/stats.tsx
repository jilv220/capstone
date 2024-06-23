import React from 'react';
import { ScrollView, XStack } from 'tamagui';
import MoodCounter from '@/components/MoodCounter';
import LineChart from '@/components/ui/LineChart';
import MoodChart from '@/components/MoodChart';

const stats = () => {
  return (
    <ScrollView py={'$7'}>
      <MoodChart />
      <MoodCounter />
    </ScrollView>
  );
};

export default stats;
