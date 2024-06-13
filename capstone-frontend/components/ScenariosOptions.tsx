import React, { Dispatch, SetStateAction } from 'react';
import {
  ActivitySquare,
  BedDouble,
  Briefcase,
  Cake,
  CloudSun,
  CookingPot,
  Cross,
  Flower2,
  Ghost,
  HeartPulse,
  MapPinned,
  MessageCircleHeart,
  School,
  Star,
  Users2,
} from '@tamagui/lucide-icons';
import { XStack } from 'tamagui';
import { Scenario, Scenarios } from '@/interfaces/scenario';
import ScenarioOption from './ScenarioOption';
import { LucideIcon } from '@/interfaces/base';

const ScenariosOptions = ({
  onOptionClick,
}: {
  onOptionClick: Dispatch<SetStateAction<Scenarios>>;
}) => {
  const categories: {
    key: Scenario;
    text: string;
    icon: LucideIcon;
  }[] = [
    { key: 'productivity', text: 'productivity', icon: ActivitySquare },
    { key: 'school', text: 'school', icon: School },
    { key: 'weather', text: 'weather', icon: CloudSun },
    { key: 'social', text: 'social', icon: Users2 },
    { key: 'food', text: 'food', icon: Cake },
    { key: 'sleep', text: 'sleep', icon: BedDouble },
    { key: 'hobbies', text: 'hobbies', icon: Star },
    { key: 'health', text: 'health', icon: HeartPulse },
    { key: 'chores', text: 'chores', icon: CookingPot },
    { key: 'romance', text: 'romance', icon: MessageCircleHeart },
    { key: 'beauty', text: 'beauty', icon: Flower2 },
    { key: 'places', text: 'places', icon: MapPinned },
    { key: 'period_symptoms', text: 'period symptoms', icon: Cross },
    { key: 'bad_habits', text: 'bad habits', icon: Ghost },
    { key: 'work', text: 'work', icon: Briefcase },
  ];

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
