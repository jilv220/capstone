import { View } from 'react-native';
import Svg, { Path, G, Text, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

import React, { Fragment } from 'react';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3TimeFormat from 'd3-time-format';
import { Angry } from '@tamagui/lucide-icons';
import { buildMoodOptions, moodToBgColor } from '@/lib/mood';
import { LucideIcon } from '@/interfaces/base';
import { Mood } from '@/interfaces/moodLog';
import { useTheme } from 'tamagui';

type DataItem = {
  date: string;
  value: number;
};

type LineChartProp = {
  data: DataItem[];
};

/**
 * Full of stupid hacks, oh yeah!
 * @returns
 */
export default function LineChart({ data }: LineChartProp) {
  const width = 300;
  const height = 200;

  const margin = { top: 10, right: 10, bottom: 40, left: 35 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3Scale
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
    .range([0, innerWidth]);

  const y = d3Scale.scaleLinear().domain([1, 5]).range([innerHeight, 0]);
  const yTicks = y.ticks(5);

  const moodOptions = buildMoodOptions().toReversed();
  const ticksWithMoodOptions = yTicks.reduce((arr, tick) => {
    return [
      ...arr,
      {
        tick,
        ...moodOptions[tick - 1],
      },
    ];
  }, [] as { tick: number; mood: Mood; bg: string; icon: LucideIcon }[]);

  const lineGenerator = d3
    .line<DataItem>()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.value))
    .defined((d) => d.value !== undefined);
  const linePath = lineGenerator(data);

  const theme = useTheme();

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop
              offset="100%"
              stopColor={moodToBgColor(moodOptions[0].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="87.4%"
              stopColor={moodToBgColor(moodOptions[1].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="62.5%"
              stopColor={moodToBgColor(moodOptions[1].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="62.4%"
              stopColor={moodToBgColor(moodOptions[2].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="37.5%"
              stopColor={moodToBgColor(moodOptions[2].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="37.4%"
              stopColor={moodToBgColor(moodOptions[3].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="12.5%"
              stopColor={moodToBgColor(moodOptions[3].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="12.4%"
              stopColor={moodToBgColor(moodOptions[4].mood, false)}
              stopOpacity={1}
            ></Stop>
            <Stop
              offset="0%"
              stopColor={moodToBgColor(moodOptions[4].mood, false)}
              stopOpacity={1}
            ></Stop>
          </LinearGradient>
        </Defs>
        <G x={margin.left} y={margin.top}>
          <Path d={linePath || ''} fill="none" stroke="url(#gradient)" strokeWidth="2" />
          <G>
            {x.ticks(5).map((tick, index) => (
              <G key={index} transform={`translate(${x(tick)},${innerHeight})`}>
                <Text fill={theme.color10.val} y="20" dy="0.71em" fontSize="10" textAnchor="middle">
                  {d3TimeFormat.timeFormat('%d')(tick)}
                </Text>
              </G>
            ))}
          </G>
          <G>
            {ticksWithMoodOptions.map((twmo, index) => (
              <Fragment key={index}>
                <G transform={`translate(-35,${y(twmo.tick + 0.3)})`}>
                  <twmo.icon fill={moodToBgColor(twmo.mood, false)} color={'white'} />
                </G>
                <G transform={`translate(-35,${y(twmo.tick)})`}>
                  <Line stroke={theme.color10.val} x1={35} x2={width} />
                </G>
              </Fragment>
            ))}
          </G>
        </G>
      </Svg>
    </View>
  );
}
