import type { Mood } from 'kysely-codegen';

const moodScoreMap = {
  rad: 5,
  good: 4,
  meh: 3,
  bad: 2,
  awful: 1,
};

export const moodToScore = (mood: Mood) => moodScoreMap[mood];
