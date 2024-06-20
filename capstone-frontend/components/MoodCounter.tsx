import { buildMoodOptions, moodToBgColor } from '@/lib/mood';
import { SizableText, YStack, Text, Card, XStack, ZStack, Circle } from 'tamagui';

import HalfPieChart from './ui/HalfPieChart';
import MoodPickerOption from './MoodPickerOption';
import MoodCounterBadge from './MoodCounterBadge';

export default function MoodCounter() {
  const moodOptions = buildMoodOptions();
  const data = [
    { value: 5, color: moodToBgColor('rad', false) },
    { value: 4, color: moodToBgColor('good', false) },
    { value: 3, color: moodToBgColor('meh', false) },
    { value: 2, color: moodToBgColor('bad', false) },
    { value: 1, color: moodToBgColor('awful', false) },
  ];

  const moodOptionsWithData = moodOptions.map((moodOption, index) => {
    return {
      ...moodOption,
      ...data[index],
    };
  });

  return (
    <Card
      elevate
      elevation={2}
      size={'$4'}
      backgroundColor={'$white3'}
      borderRadius={4}
      padded
      mx={'$4'}
    >
      <SizableText size={'$8'} fontWeight={'bold'} pb={'$2'}>
        Mood Count
      </SizableText>
      <HalfPieChart pb={'$4'} data={data} />
      <XStack jc={'space-between'}>
        {moodOptionsWithData.map((moodOption) => (
          <YStack key={moodOption.mood} position="relative">
            <MoodPickerOption Icon={moodOption.icon} bg={moodOption.bg}>
              {moodOption.mood}
            </MoodPickerOption>
            <MoodCounterBadge bg={moodOption.bg}>{moodOption.value}</MoodCounterBadge>
          </YStack>
        ))}
      </XStack>
    </Card>
  );
}
