import { GameObject } from "./GameObject";
import { Game } from "./game";

interface Note {
  time: number;
}

export interface GameLevel {
  bpm: number;
  rythm: Note[];
  endHook?: (game: Game) => void;
}

export interface InputState {
  pressedSpace: boolean;
  usedSpcae: boolean;
}

export interface GameContext {
  theme: string;
  missed_note_count: number;
  game_objects: GameObject[];
  t: number;
  debug: boolean;
  sound: Record<string, AudioBuffer>;
  images: Record<string, HTMLImageElement>;
  input: InputState;
  audio_ctx: AudioContext;
}

export const CAT_1_FRAME_NUM = 32;
export const CAT_2_FRAME_NUM = 25;
export const CAT_3_FRAME_NUM = 36;
