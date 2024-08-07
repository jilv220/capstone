import { Scenarios } from './scenario';

export type Mood = 'awful' | 'bad' | 'good' | 'meh' | 'rad';

export interface LegacyMoodData {
  mood: string;
  digitTime: string;
  scenarios: Scenarios;
  year: number;
  month: number;
  date: number;
  note?:string;
  id: string;
}

export interface MoodLog {
  id: string;
  log_date: string;
  mood: Mood;
  note?: string | null;
  user_id: string;
  scenario: Scenarios;
}

export interface MoodLogCreate {
  log_date: string;
  mood: Mood;
  note?: string | null;
  scenario: Scenarios;
}

export interface MoodLogUpdate {
  id:string;
  log_date?: string;
  mood?: Mood;
  note?: string | null;
  scenario?: Scenarios;
}

export type MoodCount = {
  [key in Mood]: number 
}

export interface MoodChartType{
  log_date:string;
  avg_score:number;
}