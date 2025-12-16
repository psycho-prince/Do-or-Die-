export enum GamePhase {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
  POST_GAME = 'POST_GAME'
}

export interface GameState {
  level: number;
  phase: GamePhase;
  lastVisit: number; // Timestamp
  kingsPathUnlocked: boolean;
}

export enum TaskCategory {
  READING = 'Reading',
  WRITING = 'Writing',
  MOVEMENT = 'Movement',
  CREATIVITY = 'Creativity',
  MUSIC = 'Music',
  REFLECTION = 'Reflection',
  KINDNESS = 'Kindness',
  LEARNING = 'Learning',
  AWARENESS = 'Awareness'
}

export interface Task {
  id: number;
  category: TaskCategory;
  narrative: string;
  instruction: string;
}