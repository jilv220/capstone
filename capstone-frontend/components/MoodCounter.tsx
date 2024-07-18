import { buildMoodOptions, moodToBgColor } from '@/lib/mood';
import { SizableText, YStack, Text, Card, XStack, ZStack, Circle, Spinner } from 'tamagui';

import HalfPieChart from './ui/HalfPieChart';
import MoodPickerOption from './MoodPickerOption';
import MoodCounterBadge from './MoodCounterBadge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMoodCount } from '@/actions/moodLog';

export default function MoodCounter() {
  const {
    data: moodCount,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['mood-log', 'mood-count'],
    queryFn: getMoodCount,
  });

  if (isPending)
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  if (isError) return <Text>Error fetching mood count data</Text>;

  const moodOptions = buildMoodOptions();
  const data = [
    { value: moodCount.rad, color: moodToBgColor('rad', false) },
    { value: moodCount.good, color: moodToBgColor('good', false) },
    { value: moodCount.meh, color: moodToBgColor('meh', false) },
    { value: moodCount.bad, color: moodToBgColor('bad', false) },
    { value: moodCount.awful, color: moodToBgColor('awful', false) },
  ];

  const moodOptionsWithData = moodOptions.map((moodOption, index) => {
    return {
      ...moodOption,
      ...data[index],
    };
  });

  return (
    <Card elevate elevation={2} size={'$4'} borderRadius={4} padded mx={'$4'}>
      <SizableText size={'$8'} fontWeight={'bold'} pb={'$3'}>
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
