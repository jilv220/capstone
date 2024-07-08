import { MoodChart, MoodCount } from '@/interfaces/moodLog';
import ky from '@/lib/kySingleton';

export async function getMoodCount() {
  return await ky.getInstance().get('user/mood-log/mood-count').json<MoodCount>();
}

export async function getMoodChart(){
  return await ky.getInstance().get('user/mood-log/mood-avg').json<MoodChart[]>();
}
