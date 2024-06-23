import { MoodCount } from '@/interfaces/moodLog';
import ky from '@/lib/kySingleton';

export async function getMoodCount() {
  return await ky.getInstance().get('user/mood-log/count').json<MoodCount>();
}