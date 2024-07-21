import React, { useEffect } from 'react';
import { ScrollView, Spinner, XStack, YStack, Text, SizableText, useTheme, Button } from 'tamagui'; // Import the Text component
import MoodCounter from '@/components/MoodCounter';
import LineChart from '@/components/ui/LineChart';
import MoodChart from '@/components/MoodChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMoodChart, getMoodCount } from '@/actions/moodLog';
import { Appearance, ImageBackground } from 'react-native';
import { ChevronsLeft, ChevronsRight } from '@tamagui/lucide-icons';

const stats = () => {
  const [monthDiff, setMonthDiff] = React.useState(0);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['mood-log', 'mood-avg'] });
    queryClient.invalidateQueries({ queryKey: ['mood-log', 'mood-count'] });
  }, [monthDiff]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['mood-log', 'mood-avg', monthDiff],
        queryFn: () => getMoodChart(monthDiff),
      },
      {
        queryKey: ['mood-log', 'mood-count', monthDiff],
        queryFn: () => getMoodCount(monthDiff),
      },
    ],
  });
  const [moodChartQuery, moodCountQuery] = queries;
  const moodChartData = moodChartQuery.data;
  const moodCountData = moodCountQuery.data;
  const isPending = queries.some((q) => q.isPending);
  const isError = queries.some((q) => q.isError);
  const theme = useTheme();
  if (isPending) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color={'$orange10'} />
      </YStack>
    );
  }
  if (isError) {
    return <Text>Error fetching mood data</Text>;
  }

  const convertMonth = (month: number) => {
    const monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthName[month];
  };
  const calculateMonthYear = (monthDiff: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthDiff);
    const year = date.getFullYear();
    return convertMonth(date.getMonth()) + ' ' + year;
  };

  return (
    <ImageBackground
      source={
        theme.background.val === '#050505'
          ? require('../../assets/images/black-star.png')
          : require('../../assets/images/white-star.png')
      }
      style={{ flex: 1 }}
    >
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <ScrollView pt={'$8'}>
        <XStack flex={1} justifyContent="center">
          <Button
            width={'$5'}
            backgroundColor={'$colorTransparent'}
            onPress={() => setMonthDiff(monthDiff + 1)}
          >
            <ChevronsLeft size={'$2'} />
          </Button>
          <SizableText
            width={'$12'}
            textAlign="center"
            alignSelf="center"
            fontSize={'$5'}
            fontWeight={'bold'}
            color={'#f9476c'}
          >
            {calculateMonthYear(monthDiff)}
          </SizableText>
          <Button
            width={'$5'}
            backgroundColor={'$colorTransparent'}
            onPress={() => {
              if (monthDiff === 0) return;
              setMonthDiff(monthDiff - 1);
            }}
          >
            <ChevronsRight size={'$2'} />
          </Button>
        </XStack>
        <MoodChart data={moodChartData || []} />
        <MoodCounter moodCount={moodCountData || { awful: 0, bad: 0, good: 0, meh: 0, rad: 0 }} />
      </ScrollView>
      {/* </SafeAreaView> */}
    </ImageBackground>
  );
};

export default stats;
