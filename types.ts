
export enum GameState {
  HOME = 'HOME',
  LEVEL_SELECT = 'LEVEL_SELECT',
  BLUETOOTH_DISCOVERY = 'BLUETOOTH_DISCOVERY',
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS'
}

export type PuzzleType = 'text' | 'visual_pattern' | 'logic_emoji' | 'math_fun';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  question: string;
  visualData?: string[]; // For patterns or emoji logic
  options: string[];
  answer: string;
  hint: string;
  points: number;
}

export interface Device {
  id: string;
  name: string;
  status: 'available' | 'connecting' | 'connected';
}
