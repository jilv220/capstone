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
  scenarioIsExist?: boolean;
}

export default function ScenarioOption({
  bg,
  children,
  onPressHandler,
  Icon,
  IconSize,
  scenario,
  scenarioIsExist,
}: ScenarioOption) {
  const theme = useTheme();
  const [isChosen, toggleChosen] = useState(scenarioIsExist);
  return (
    <YStack alignItems="center" gap={'$1.5'}>
      <Button
        size={'$4'}
        bg={isChosen ? 'yellowgreen' : '$color0'}
        onPress={() => {
          if (!isChosen) {
            onPressHandler((prev) => [...prev, scenario]);
          } else {
            onPressHandler((prev) => prev.filter((sc) => sc !== scenario));
          }

          toggleChosen(!isChosen);
        }}
        circular
        icon={
          Icon && <Icon size={IconSize || '$4'} color={isChosen ? '$background' : 'yellowgreen'} />
        }
      ></Button>
      <Text color={bg || theme.color} fontSize={'$1'} fow={100}>
        {children}
      </Text>
    </YStack>
  );
}
