import { MoodLog, MoodLogCreate, MoodLogUpdate } from '@/interfaces/moodLog';
import ky from '@/lib/kySingleton';

export async function getUser() {
  let user;
  try {
    user = await ky.getInstance().get('user/me').json();
  } catch (e) {
    console.error(e);
  }

  return user;
}

export async function getMoodLogs() {
  return await ky.getInstance().get('user/mood-log').json<MoodLog[]>();
}

export async function createMoodLog(moodlog: MoodLogCreate) {
  return await ky
    .getInstance()
    .post('user/mood-log', {
      json: moodlog,
    })
    .json();
}

export async function deleteMoodLog(id: string) {
  return await ky.getInstance().delete(`user/mood-log/${id}`);
}

export async function updateMoodLog(moodlogUpdated: MoodLogUpdate) {
  return await ky.getInstance().patch(`user/mood-log/${moodlogUpdated.id}`, {
    json: moodlogUpdated,
  });
}
