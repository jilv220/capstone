import { Card, SizableText, XStack, YStack } from 'tamagui';
import LineChart from './ui/LineChart';

export default function MoodChart() {
  const data = [
    { date: '2024-06-08T00:00:00', value: 4.75 },
    { date: '2024-06-09T00:00:00', value: 4 },
    { date: '2024-06-10T00:00:00', value: 3 },
    { date: '2024-06-11T00:00:00', value: 1.25 },
    { date: '2024-06-12T00:00:00', value: 3.5 },
    { date: '2024-06-13T00:00:00', value: 2.5 },
    { date: '2024-06-14T00:00:00', value: 4 },
    { date: '2024-06-15T00:00:00', value: 4.75 },
    { date: '2024-06-16T00:00:00', value: 5 },
    { date: '2024-06-17T00:00:00', value: 1.5 },
    { date: '2024-06-18T00:00:00', value: 1 },
    { date: '2024-06-19T00:00:00', value: 3.5 },
    { date: '2024-06-20T00:00:00', value: 1.25 },
    { date: '2024-06-21T00:00:00', value: 4 },
  ];

  return (
    <Card elevate elevation={2} size={'$4'} borderRadius={4} padded mx={'$4'} mb={'$4'}>
      <SizableText size={'$8'} fontWeight={'bold'} pb={'$3'}>
        Mood Chart
      </SizableText>
      <LineChart data={data} />
    </Card>
  );
}
