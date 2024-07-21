import { View } from 'react-native';
import Svg, { Path, G, Text, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import React, { Fragment, useMemo } from 'react';
import * as d3 from 'd3';
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

export default function LineChart({ data }: LineChartProp) {
  const width = 300;
  const height = 200;

  const margin = { top: 10, right: 10, bottom: 40, left: 35 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
        .range([0, innerWidth]),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () => d3.scaleLinear().domain([1, 5]).range([innerHeight, 0]),
    [innerHeight]
  );

  const lineGenerator = useMemo(
    () =>
      d3
        .line<DataItem>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.value))
        .defined((d) => d.value !== undefined),
    [xScale, yScale]
  );

  const linePath = lineGenerator(data);
  const theme = useTheme();

  const moodOptions = useMemo(() => buildMoodOptions().reverse(), []);
  const yTicks = useMemo(() => yScale.ticks(5), [yScale]);

  const ticksWithMoodOptions = useMemo(
    () =>
      yTicks.map((tick) => ({
        tick,
        ...moodOptions[tick - 1],
      })),
    [yTicks, moodOptions]
  );

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop
              offset="100%"
              stopColor={moodToBgColor(moodOptions[0].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="87.4%"
              stopColor={moodToBgColor(moodOptions[1].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="62.5%"
              stopColor={moodToBgColor(moodOptions[1].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="62.4%"
              stopColor={moodToBgColor(moodOptions[2].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="37.5%"
              stopColor={moodToBgColor(moodOptions[2].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="37.4%"
              stopColor={moodToBgColor(moodOptions[3].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="12.5%"
              stopColor={moodToBgColor(moodOptions[3].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="12.4%"
              stopColor={moodToBgColor(moodOptions[4].mood, false)}
              stopOpacity={1}
            />
            <Stop
              offset="0%"
              stopColor={moodToBgColor(moodOptions[4].mood, false)}
              stopOpacity={1}
            />
          </LinearGradient>
        </Defs>
        <G x={margin.left} y={margin.top}>
          <Path d={linePath || ''} fill="none" stroke="url(#gradient)" strokeWidth="2" />
          <G>
            {xScale.ticks(5).map((tick, index) => (
              <G key={index} transform={`translate(${xScale(tick)},${innerHeight})`}>
                <Text fill={theme.color10.val} y="20" dy="0.71em" fontSize="10" textAnchor="middle">
                  {d3.timeFormat('%d')(tick)}
                </Text>
              </G>
            ))}
          </G>
          <G>
            {ticksWithMoodOptions.map((twmo, index) => (
              <Fragment key={index}>
                <G transform={`translate(-35,${yScale(twmo.tick + 0.3)})`}>
                  <twmo.icon fill={moodToBgColor(twmo.mood, false)} color={'white'} />
                </G>
                <G transform={`translate(-35,${yScale(twmo.tick)})`}>
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
