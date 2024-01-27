import { GameObject } from "./GameObject";
import { Game } from "./game";

interface Note {
  time: number;
}

interface GameLevel {
  bpm: number;
  rythm: Note[];
  endHook?: (game: Game) => void;
}

const level1: GameLevel = {
  bpm: 120,
  rythm: [{ time: 0 }, { time: 1 }, { time: 2 }, { time: 3 }],
};

const end: GameLevel = {
  bpm: 120,
  rythm: [],
  endHook: (game: Game) => {
    game.pause();
  },
};

export interface InputState {
  pressedSpace: boolean;
  usedSpcae: boolean;
}

export interface GameContext {
  game_objects: GameObject[];
  t: number;
  debug: boolean;
  sound: Record<string, AudioBuffer>;
  images: Record<string, HTMLImageElement>;
  input: InputState;
  audio_ctx: AudioContext;
  missed_note: boolean;
}
