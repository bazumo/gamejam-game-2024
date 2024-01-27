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

interface ClapEvent {
  msTime: number;
  tolerance: number;
}

const events = [level1, level1, end];

/** AUDIO */
const audioContext = new AudioContext();

async function loadAudio(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function resolveObject<T>(
  obj: Record<string, Promise<T>>
): Promise<Record<string, T>> {
  return Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ).then(Object.fromEntries);
}

const audioFiles = {
  clap: loadAudio("/music/clap.mp3"),
};

async function loadMusic() {
  return await resolveObject(audioFiles);
}

// 120 bpm = 2 beats per second

function convertToFlatEvents(levels: GameLevel[]) {
  const flatEvents: ClapEvent[] = [];
  const levelStartOffset = 0;
  for (const level of levels) {
    const msPerBeat = (60 / level.bpm) * 1000;
    for (const note of level.rythm) {
      flatEvents.push({
        msTime: levelStartOffset + note.time * msPerBeat,
        tolerance: msPerBeat / 4,
      });
    }
  }
  return flatEvents;
}

const clapTimeline = convertToFlatEvents(events);

abstract class GameObject {
  constructor() {}

  abstract tick(game_ctx: GameContext): void;

  abstract draw(
    draw_ctx: CanvasRenderingContext2D,
    game_ctx: GameContext
  ): void;
}

interface InputState {
  pressedSpace: boolean;
}

interface GameContext {
  t: number;
  sound: Record<string, AudioBuffer>;
  input: InputState;
}

class Clap extends GameObject {
  private clap_state: "idle" | "in_range_not_played" | "in_range_played" =
    "idle";

  private time: number = 0;
  private threshold: number = 0;

  constructor(time: number) {
    super();
    this.time = time;
  }

  playSound(buffer: AudioBuffer) {
    playSound(buffer);
  }

  tick(game_ctx: GameContext) {
    const { t } = game_ctx;
    console.log("clap tick", t);
    if (this.clap_state === "idle") {
      if (t > this.time - this.threshold && t < this.time + this.threshold) {
        this.clap_state = "in_range_not_played";
      }
    } else if (this.clap_state === "in_range_not_played") {
      if (t > this.time + this.threshold) {
        this.clap_state = "in_range_played";
        playSound(game_ctx.sound.clap);
      }
    }
  }

  draw(draw_ctx: CanvasRenderingContext2D) {}
}

const START_DELAY = 0;

class SoundEffect extends GameObject {
  private started: boolean = false;

  private time: number = 0;

  playSound(buffer: AudioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  }

  constructor(time: number) {
    super();
    this.time = time;
  }

  tick(game_ctx: GameContext) {
    const { t } = game_ctx;
    console.log("clap tick", t);
    if (!this.started) {
      if (t > this.time - START_DELAY) {
        this.started = true;
        this.playSound(game_ctx.sound.clap);
      }
    }
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const { t } = game_ctx;
    const x = t - this.time;
    draw_ctx.fillStyle = "red";
    draw_ctx.fillRect(x, 0, 100, 100);
  }
}

export class Game {
  // Lifecycle and time
  private last_timestamp: number = 0;
  private _stop: boolean = false;

  // gameContext
  private gameContext: GameContext = {
    t: 0,
    sound: {},
    input: {
      pressedSpace: false,
    },
  };

  // Game object
  private gameObjects: GameObject[] = [];

  // Drawing
  private canvas: HTMLCanvasElement | null = null;

  constructor() {
    this.last_timestamp = performance.now();
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.gameContext.input.pressedSpace = true;
      }
    });
    this.gameObjects.push(new SoundEffect(1000));
    this.gameObjects.push(new SoundEffect(1500));
    this.gameObjects.push(new SoundEffect(2000));
    this.gameObjects.push(new SoundEffect(2500));
  }

  async init() {
    // Load all sounds and add them to the gameContext
    const sounds = await loadMusic();
    this.gameContext.sound = sounds;
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // Lifecycle
  resume() {
    this._stop = false;
    this.last_timestamp = performance.now();
    requestAnimationFrame(() => this.loop());
  }

  pause() {
    this._stop = true;
  }

  test() {
    this.canvas?.getContext("2d")?.fillRect(0, 0, 100, 100);
  }

  updateGameTime() {
    const now = performance.now();
    const delta = now - this.last_timestamp;
    this.last_timestamp = now;
    this.gameContext.t += delta;
    console.log("gameTime", this.gameContext.t);
  }

  processGameObjects() {
    for (const gameObject of this.gameObjects) {
      gameObject.tick(this.gameContext);
    }
  }

  drawGameObjects() {
    for (const gameObject of this.gameObjects) {
      gameObject.draw(this.canvas!.getContext("2d")!, this.gameContext);
    }
  }

  loop() {
    console.log("tick");

    // update the gametime
    this.updateGameTime();

    // todo preprocess input???

    // process game objects
    this.processGameObjects();

    // draw calls
    if (this.canvas) {
      this.canvas.getContext("2d")?.clearRect(0, 0, 1920, 1080);
      this.drawGameObjects();
    }

    // stop if needed
    if (this._stop) {
      return;
    }
    requestAnimationFrame(() => this.loop());
  }
}

export function createNewGame() {
  return new Game();
}
