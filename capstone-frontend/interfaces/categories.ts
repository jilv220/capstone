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
import { Scenario } from './scenario';
import { LucideIcon } from './base';

// This file is an interface file for categories
export const categories: {
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