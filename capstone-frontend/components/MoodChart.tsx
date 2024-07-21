import { Card, SizableText, Spinner, XStack, YStack } from 'tamagui';
import LineChart from './ui/LineChart';
import { useQuery } from '@tanstack/react-query';
import { getMoodChart } from '@/actions/moodLog';
import { Text } from 'react-native';
import { MoodChartType } from '@/interfaces/moodLog';
export default function MoodChart({ data }: { data: MoodChartType[] }) {
  const convertedData: { date: string; value: number }[] = data
    ? data.map((item) => ({
        date: item.log_date,
        value: item.avg_score,
      }))
    : [];

  return (
    <Card elevate elevation={2} size={'$4'} borderRadius={4} padded mx={'$4'} mb={'$4'}>
      <SizableText size={'$8'} fontWeight={'bold'} pb={'$3'}>
        Mood Chart
      </SizableText>
      <LineChart data={convertedData} />
    </Card>
  );
}
