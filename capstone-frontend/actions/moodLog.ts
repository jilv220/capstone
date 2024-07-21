import { MoodChartType, MoodCount } from '@/interfaces/moodLog';
import ky from '@/lib/kySingleton';

export async function getMoodCount(monthDiff: number) {
  if(monthDiff === 0) return await ky.getInstance().get('user/mood-log/mood-count').json<MoodCount>();
  return await ky.getInstance().get(`user/mood-log/mood-count?prev=${monthDiff}`).json<MoodCount>();
}

export async function getMoodChart(monthDiff: number) {
  if(monthDiff===0) return await ky.getInstance().get('user/mood-log/mood-avg').json<MoodChartType[]>();
  return await ky.getInstance().get(`user/mood-log/mood-avg?prev=${monthDiff}`).json<MoodChartType[]>();
}
