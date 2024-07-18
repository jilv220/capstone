import { Card, SizableText, Spinner, XStack, YStack } from 'tamagui';
import LineChart from './ui/LineChart';
import { useQuery } from '@tanstack/react-query';
import { getMoodChart } from '@/actions/moodLog';
import { Text } from 'react-native';
export default function MoodChart() {
  const {
    data: rawData,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['mood-log', 'mood-avg'],
    queryFn: getMoodChart,
  });
  let data: { date: string; value: number }[] = [];
  if (rawData) {
    data = rawData.map((item) => {
      return {
        date: item.log_date,
        value: item.avg_score,
      };
    });
  }
  if (isPending)
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  if (isError) return <Text>Error fetching mood chart data</Text>;

  return (
    <Card elevate elevation={2} size={'$4'} borderRadius={4} padded mx={'$4'} mb={'$4'}>
      <SizableText size={'$8'} fontWeight={'bold'} pb={'$3'}>
        Mood Chart
      </SizableText>
      <LineChart data={data} />
    </Card>
  );
}
