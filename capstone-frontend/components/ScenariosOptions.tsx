import { View, Text } from 'react-native';
import React from 'react';
import MoodPickerOption from './MoodPickerOption';
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

const ScenariosOptions = () => {
  const categories = [
    { key: 'product', value: ActivitySquare },
    { key: 'school', value: School },
    { key: 'weather', value: CloudSun },
    { key: 'social', value: Users2 },
    { key: 'food', value: Cake },
    { key: 'sleep', value: BedDouble },
    { key: 'hobbies', value: Star },
    { key: 'health', value: HeartPulse },
    { key: 'chores', value: CookingPot },
    { key: 'romance', value: MessageCircleHeart },
    { key: 'beauty', value: Flower2 },
    { key: 'places', value: MapPinned },
    { key: 'period', value: Cross },
    { key: 'habits', value: Ghost },
    { key: 'work', value: Briefcase },
  ];

  return (
    <XStack px="$1" py="$5" justifyContent="space-evenly" flexDirection="row" flexWrap="wrap">
      {categories.map((category, index) => {
        return (
          <XStack key={index} px="$2" py="$2" width={'$6'} justifyContent="center">
            <MoodPickerOption
              bg={'yellowgreen'}
              IconColor={'white'}
              Icon={category.value}
              IconSize={'$2'}
            >
              {category.key}
            </MoodPickerOption>
          </XStack>
        );
      })}
    </XStack>
  );
};

export default ScenariosOptions;
