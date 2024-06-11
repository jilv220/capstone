import type { Insertable, Updateable } from 'kysely';
import type { MoodLog } from 'kysely-codegen';

export type MoodLogCreate = Insertable<MoodLog>;
export type MoodLogUpdate = Omit<Updateable<MoodLog>, 'id' | 'user_id'> & {
  id: string;
  user_id: string;
};
