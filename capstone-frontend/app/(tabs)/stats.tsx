import React from 'react';
import { ScrollView } from 'tamagui';
import MoodCounter from '@/components/MoodCounter';

const stats = () => {
  return (
    <ScrollView py={'$7'}>
      <MoodCounter />
    </ScrollView>
  );
};

export default stats;
