import { Card, SizableText, Spinner, XStack, YStack } from 'tamagui';
import LineChart from './ui/LineChart';
import { useQuery } from '@tanstack/react-query';
import { getMoodChart } from '@/actions/moodLog';
import { Text } from 'react-native';
export default function MoodChart() {
  const { data: rawData, isError } = useQuery({
    queryKey: ['mood-log', 'mood-avg'],
    queryFn: getMoodChart,
  });

  const data: { date: string; value: number }[] = rawData
    ? rawData.map((item) => ({
        date: item.log_date,
        value: item.avg_score,
      }))
    : [];

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
