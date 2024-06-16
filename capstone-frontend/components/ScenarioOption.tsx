import { LucideIcon, ReactSetStateType } from '@/interfaces/base';
import { Scenario, Scenarios } from '@/interfaces/scenario';
import { useState } from 'react';
import { YStack, Text, Circle, useTheme, Button, GetProps } from 'tamagui';

interface ScenarioOption extends GetProps<LucideIcon> {
  onPressHandler: ReactSetStateType<Scenarios>;
  Icon?: LucideIcon;
  children?: string;
  bg?: string;
  IconSize?: string;
  scenario: Scenario;
}

export default function ScenarioOption({
  bg,
  children,
  onPressHandler,
  Icon,
  IconSize,
  scenario,
}: ScenarioOption) {
  const theme = useTheme();
  const [isChosen, toggleChosen] = useState(false);

  return (
    <YStack alignItems="center" gap={'$2'}>
      <Button
        size={'$4'}
        bg={isChosen ? '$green9' : '$color0'}
        onPress={() => {
          if (!isChosen) {
            onPressHandler((prev) => [...prev, scenario]);
          } else {
            onPressHandler((prev) => prev.filter((sc) => sc !== scenario));
          }

          toggleChosen(!isChosen);
        }}
        circular
        icon={Icon && <Icon size={IconSize || '$4'} color={isChosen ? '$background' : '$green9'} />}
      ></Button>
      <Text color={bg || theme.color} fontSize={'$1'} fow={100}>
        {children}
      </Text>
    </YStack>
  );
}
