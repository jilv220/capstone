import { describe, expect, test } from 'bun:test';
import type { Mood } from 'kysely-codegen';
import { MoodLogService } from './moodLog.ts';

describe('MoodLogService.getStreakHistory', () => {
  test('single day streak', () => {
    const testData = [{ log_date: '2023-06-25T00:00:00.000Z', has_mood_log: true }].map((v) => {
      return {
        log_date: new Date(v.log_date),
        has_mood_log: v.has_mood_log,
      };
    });

    const streakHistory = MoodLogService.getStreakHistory(testData);
    expect(streakHistory).toEqual({
      current: 1,
      longest: 1,
    });
  });

  test('alternating streaks', () => {
    const testData = [
      { log_date: '2023-06-25T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-24T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-23T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-22T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-21T00:00:00.000Z', has_mood_log: true },
    ].map((v) => {
      return {
        log_date: new Date(v.log_date),
        has_mood_log: v.has_mood_log,
      };
    });

    const streakHistory = MoodLogService.getStreakHistory(testData);
    expect(streakHistory).toEqual({
      current: 1,
      longest: 1,
    });
  });

  test('full streak', () => {
    const testData = [
      { log_date: '2023-06-25T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-24T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-23T00:00:00.000Z', has_mood_log: true },
    ].map((v) => {
      return {
        log_date: new Date(v.log_date),
        has_mood_log: v.has_mood_log,
      };
    });

    const streakHistory = MoodLogService.getStreakHistory(testData);
    expect(streakHistory).toEqual({
      current: 3,
      longest: 3,
    });
  });

  test('zero streak', () => {
    const testData = [
      { log_date: '2023-06-25T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-24T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-23T00:00:00.000Z', has_mood_log: false },
    ].map((v) => {
      return {
        log_date: new Date(v.log_date),
        has_mood_log: v.has_mood_log,
      };
    });

    const streakHistory = MoodLogService.getStreakHistory(testData);
    expect(streakHistory).toEqual({
      current: 0,
      longest: 0,
    });
  });

  test('no current streak', () => {
    const testData = [
      { log_date: '2023-06-25T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-24T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-23T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-22T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-21T00:00:00.000Z', has_mood_log: false },
      { log_date: '2023-06-20T00:00:00.000Z', has_mood_log: true },
      { log_date: '2023-06-19T00:00:00.000Z', has_mood_log: false },
      { log_date: '2022-06-26T00:00:00.000Z', has_mood_log: false },
      { log_date: '2022-06-25T00:00:00.000Z', has_mood_log: true },
    ].map((v) => {
      return {
        log_date: new Date(v.log_date),
        has_mood_log: v.has_mood_log,
      };
    });

    const streakHistory = MoodLogService.getStreakHistory(testData);
    expect(streakHistory).toEqual({
      current: 0,
      longest: 2,
    });
  });
});

describe('MoodLogService.getDailyAvgScores', () => {
  test('simple', () => {
    const testData = [
      { log_date: '2024-06-01T00:00:00Z', mood: 'good' },
      { log_date: '2024-06-02T00:00:00Z', mood: 'bad' },
      { log_date: '2024-06-03T00:00:00Z', mood: 'meh' },
    ].map((d) => {
      return {
        log_date: new Date(d.log_date),
        mood: d.mood as Mood,
      };
    });

    const scores = MoodLogService.getDailyAvgScores(testData);
    expect(scores).toEqual([
      { log_date: '2024-06-01T00:00:00.000Z', avg_score: 4 },
      { log_date: '2024-06-02T00:00:00.000Z', avg_score: 2 },
      { log_date: '2024-06-03T00:00:00.000Z', avg_score: 3 },
    ]);
  });

  test('multiple entries per day', () => {
    const testData = [
      { log_date: '2024-06-01T00:00:00Z', mood: 'good' },
      { log_date: '2024-06-01T00:00:00Z', mood: 'meh' },
      { log_date: '2024-06-02T00:00:00Z', mood: 'bad' },
      { log_date: '2024-06-02T00:00:00Z', mood: 'awful' },
    ].map((d) => {
      return {
        log_date: new Date(d.log_date),
        mood: d.mood as Mood,
      };
    });

    const scores = MoodLogService.getDailyAvgScores(testData);
    expect(scores).toEqual([
      { log_date: '2024-06-01T00:00:00.000Z', avg_score: 3.5 },
      { log_date: '2024-06-02T00:00:00.000Z', avg_score: 1.5 },
    ]);
  });

  test('single entry', () => {
    const testData = [{ log_date: '2024-06-01T00:00:00Z', mood: 'rad' }].map((d) => {
      return {
        log_date: new Date(d.log_date),
        mood: d.mood as Mood,
      };
    });

    const scores = MoodLogService.getDailyAvgScores(testData);
    expect(scores).toEqual([{ log_date: '2024-06-01T00:00:00.000Z', avg_score: 5 }]);
  });

  test('different months', () => {
    const testData = [
      { log_date: '2024-05-31T00:00:00Z', mood: 'awful' },
      { log_date: '2024-06-01T00:00:00Z', mood: 'rad' },
      { log_date: '2024-07-01T00:00:00Z', mood: 'good' },
    ].map((d) => {
      return {
        log_date: new Date(d.log_date),
        mood: d.mood as Mood,
      };
    });

    const scores = MoodLogService.getDailyAvgScores(testData);
    expect(scores).toEqual([
      { log_date: '2024-05-31T00:00:00.000Z', avg_score: 1 },
      { log_date: '2024-06-01T00:00:00.000Z', avg_score: 5 },
      { log_date: '2024-07-01T00:00:00.000Z', avg_score: 4 },
    ]);
  });

  test('no data', () => {
    const testData: { mood: Mood; log_date: Date }[] = [];
    const scores = MoodLogService.getDailyAvgScores(testData);
    expect(scores).toEqual([]);
  });
});
