export type Level = 1 | 2 | 3 | 4;
export type QuizMode = 'multiple' | 'typing';
export type QuizFilter = 'all' | 'wrong';

export interface Word {
  id: number;
  word: string;
  meaning: string;
  level: Level;
  exampleEn?: string;
  exampleJp?: string;
}

export interface QuizState {
  mode: QuizMode;
  filter: QuizFilter;
  level: Level | 'all';
  wordIds: number[];
  currentIndex: number;
  correctCount: number;
  answered: boolean;
  lastCorrect: boolean | null;
}

export interface AppState {
  view: 'home' | 'quiz' | 'result' | 'wrong-list';
  wrongIds: number[];
}
