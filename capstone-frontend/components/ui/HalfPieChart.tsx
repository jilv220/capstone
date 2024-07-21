import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Text } from 'react-native-svg';
import { GetProps, YStack, YStackProps, useTheme } from 'tamagui';

import * as d3Shape from 'd3-shape';

type DataItem = {
  value: number;
  color: string;
};

type HalfPieChartProp = {
  data: DataItem[];
} & YStackProps;

export default function HalfPieChart({ data, ...props }: HalfPieChartProp) {
  const pieData = useMemo(
    () =>
      d3Shape
        .pie<DataItem>()
        .value((d) => d.value)
        // Disable Sorting
        .sortValues(null)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2)(data),
    [data]
  );

  const arc = d3Shape.arc<d3Shape.PieArcDatum<DataItem>>().outerRadius(100).innerRadius(65);
  const total = data.reduce((acc, d) => acc + d.value, 0);

  const theme = useTheme();

  return (
    <YStack jc={'center'} ai={'center'} {...props}>
      <Svg height={100} width={200}>
        <G x={100} y={100}>
          {pieData.map((slice, index) => (
            <Path key={index} d={arc(slice) || ''} fill={slice.data.color} />
          ))}
          <Text fontSize={30} textAnchor="middle" translateY={-10} fill={theme.color.val}>
            {total}
          </Text>
        </G>
      </Svg>
    </YStack>
  );
}
