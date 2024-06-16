import React, { Dispatch, SetStateAction } from 'react';

import { XStack } from 'tamagui';
import { Scenario, Scenarios } from '@/interfaces/scenario';
import ScenarioOption from './ScenarioOption';
import { LucideIcon } from '@/interfaces/base';
import { categories } from '@/interfaces/categories';
const ScenariosOptions = ({
  onOptionClick,
}: {
  onOptionClick: Dispatch<SetStateAction<Scenarios>>;
}) => {
  return (
    <XStack px="$1" py="$5" justifyContent="space-evenly" flexDirection="row" flexWrap="wrap">
      {categories.map((category) => {
        return (
          <XStack key={category.key} px="$2" py="$2" width={'$6'} justifyContent="center">
            <ScenarioOption
              scenario={category.key}
              Icon={category.icon}
              IconSize={'$2'}
              onPressHandler={onOptionClick}
            >
              {category.text}
            </ScenarioOption>
          </XStack>
        );
      })}
    </XStack>
  );
};

export default ScenariosOptions;
