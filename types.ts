export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: Date;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  content: string;
  title?: string;
  tags?: string[];
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DIET = 'DIET',
  WATER = 'WATER',
  SUPPORT = 'SUPPORT',
  JOURNAL = 'JOURNAL'
}