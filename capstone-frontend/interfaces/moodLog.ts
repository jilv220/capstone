import { Scenarios } from "./scenario";

type Mood = 'awful' | 'bad' | 'good' | 'meh' | 'rad';

export interface LegacyMoodData {
  mood: string;
  digitTime: string;
  moodReason: string;
  year: number;
  month: number;
  date: number;
  id: string;
}

export interface MoodLog {
  id: string;
  log_date: string;   
  mood: Mood;
  note?: string | null;
  user_id: string;
  scenario: Partial<Scenarios>;
}

export interface MoodLogCreate {
  log_date: string;
  mood: Mood;
  note?: string | null;
  scenario: Partial<Scenarios>;
}

export interface MoodLogUpdate {
  log_date?: string;
  mood?: Mood;
  note?: string | null;
  scenario?: Partial<Scenarios>;
}