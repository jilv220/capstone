import { Mood } from '@/interfaces/moodLog';
import { tokens } from '@tamagui/config/v3';
import { Angry, Frown, Laugh, Meh, Smile } from '@tamagui/lucide-icons';

const defaultArrangement: Mood[] = ['rad', 'good', 'meh', 'bad', 'awful'];

const moodBgColorMap = {
  rad: '$green9Light',
  good: 'limegreen',
  meh: '$yellow9Dark',
  bad: 'orange',
  awful: 'red',
};

const moodBgColorMapNative = {
  rad: tokens.color.green9Light.val,
  good: 'limegreen',
  meh: tokens.color.yellow9Dark.val,
  bad: 'orange',
  awful: 'red',
};

const moodIconMap = {
  rad: Laugh,
  good: Smile,
  meh: Meh,
  bad: Frown,
  awful: Angry,
};

export const moodToBgColor = (mood: Mood, isTamagui = true) => {
  return isTamagui ? moodBgColorMap[mood] : moodBgColorMapNative[mood];
};
export const moodToIcon = (mood: Mood) => moodIconMap[mood];

export const buildMoodOptions = (moodArr = defaultArrangement) => {
  return moodArr.map((mood) => {
    return {
      mood,
      bg: moodToBgColor(mood),
      icon: moodToIcon(mood),
    };
  });
};
