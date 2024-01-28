import { generateScenes } from "./Scene";
import {
  CAT_1_FRAME_NUM,
  CAT_2_FRAME_NUM,
  CAT_3_FRAME_NUM,
  GameContext,
} from "./types";

/** AUDIO */
const audioContext = new AudioContext();

async function loadAudio(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
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
  title_music: loadAudio("/music/Game Jam_1.mp3"),
  game_music: loadAudio("/music/Game Jam_3.mp3"),
};

export const OFFSET_TOP_TARGET = 100;

const imageFiles = {
  fuchs1_0: loadImage("/sprite/fuch1/fuch0.png"),
  fuchs1_1: loadImage("/sprite/fuch1/fuch1.png"),
  fuchs1_2: loadImage("/sprite/fuch1/fuch2.png"),
  fuchs1_3: loadImage("/sprite/fuch1/fuch3.png"),
  fuchs1_4: loadImage("/sprite/fuch1/fuch4.png"),
  fuchs1_5: loadImage("/sprite/fuch1/fuch5.png"),
  fuchs1_6: loadImage("/sprite/fuch1/fuch6.png"),
  fuchs1_7: loadImage("/sprite/fuch1/fuch7.png"),
  fuchs1_8: loadImage("/sprite/fuch1/fuch8.png"),
  fuchs1_9: loadImage("/sprite/fuch1/fuch9.png"),
  fuchs1_10: loadImage("/sprite/fuch1/fuch10.png"),
  fuchs1_11: loadImage("/sprite/fuch1/fuch11.png"),
  fuchs1_12: loadImage("/sprite/fuch1/fuch12.png"),
  fuchs1_13: loadImage("/sprite/fuch1/fuch13.png"),
  fuchs1_14: loadImage("/sprite/fuch1/fuch14.png"),
  fuchs1_15: loadImage("/sprite/fuch1/fuch15.png"),

  fuchs1_16: loadImage("/sprite/fuch2/fuch right 1.png"),
  fuchs1_17: loadImage("/sprite/fuch2/fuch right 2.png"),
  fuchs1_18: loadImage("/sprite/fuch2/fuch left 1.png"),
  fuchs1_19: loadImage("/sprite/fuch2/fuch left 2.png"),
  chicken_right_16: loadImage("/sprite/chicken right/chicken death right.png"),
  chicken_left_16: loadImage("/sprite/chicken left/chicken death left.png"),

  chicken_left_0: loadImage("/sprite/chicken left/chicken left 0.png"),
  chicken_left_1: loadImage("/sprite/chicken left/chicken left 1.png"),
  chicken_left_2: loadImage("/sprite/chicken left/chicken left 2.png"),
  chicken_left_3: loadImage("/sprite/chicken left/chicken left 3.png"),
  chicken_left_4: loadImage("/sprite/chicken left/chicken left 4.png"),
  chicken_left_5: loadImage("/sprite/chicken left/chicken left 5.png"),
  chicken_left_6: loadImage("/sprite/chicken left/chicken left 6.png"),
  chicken_left_7: loadImage("/sprite/chicken left/chicken left 7.png"),
  chicken_left_8: loadImage("/sprite/chicken left/chicken left 8.png"),
  chicken_left_9: loadImage("/sprite/chicken left/chicken left 9.png"),
  chicken_left_10: loadImage("/sprite/chicken left/chicken left 10.png"),
  chicken_left_11: loadImage("/sprite/chicken left/chicken left 11.png"),
  chicken_left_12: loadImage("/sprite/chicken left/chicken left 12.png"),
  chicken_left_13: loadImage("/sprite/chicken left/chicken left 13.png"),
  chicken_left_14: loadImage("/sprite/chicken left/chicken left 14.png"),
  chicken_left_15: loadImage("/sprite/chicken left/chicken left 15.png"),

  chicken_right_0: loadImage("/sprite/chicken right/chicken right 0.png"),
  chicken_right_1: loadImage("/sprite/chicken right/chicken right 1.png"),
  chicken_right_2: loadImage("/sprite/chicken right/chicken right 2.png"),
  chicken_right_3: loadImage("/sprite/chicken right/chicken right 3.png"),
  chicken_right_4: loadImage("/sprite/chicken right/chicken right 4.png"),
  chicken_right_5: loadImage("/sprite/chicken right/chicken right 5.png"),
  chicken_right_6: loadImage("/sprite/chicken right/chicken right 6.png"),
  chicken_right_7: loadImage("/sprite/chicken right/chicken right 7.png"),
  chicken_right_8: loadImage("/sprite/chicken right/chicken right 8.png"),
  chicken_right_9: loadImage("/sprite/chicken right/chicken right 9.png"),
  chicken_right_10: loadImage("/sprite/chicken right/chicken right 10.png"),
  chicken_right_11: loadImage("/sprite/chicken right/chicken right 11.png"),
  chicken_right_12: loadImage("/sprite/chicken right/chicken right 12.png"),
  chicken_right_13: loadImage("/sprite/chicken right/chicken right 13.png"),
  chicken_right_14: loadImage("/sprite/chicken right/chicken right 14.png"),
  chicken_right_15: loadImage("/sprite/chicken right/chicken right 15.png"),

  cat_button_outline: loadImage("/sprite/button/button cat2.png"),
  fuchs_button_outline: loadImage("/sprite/button/button duck2.png"),

  cat_button_fail: loadImage("/sprite/button/button cat3.png"),
  fuchs_button_fail: loadImage("/sprite/button/button duck3.png"),

  cat_button_note: loadImage("/sprite/button/button cat0.png"),
  fuchs_button_note: loadImage("/sprite/button/button duck0.png"),

  cat_button_success: loadImage("/sprite/button/button cat4.png"),
  fuchs_button_success: loadImage("/sprite/button/button duck4.png"),

  cat_bg: loadImage("/sprite/background/cat bg 1.png"),
  fuchs_bg_0: loadImage("/sprite/background/fuch bg 0.png"),
  fuchs_bg_1: loadImage("/sprite/background/fuch bg 1.png"),
} as Record<string, Promise<HTMLImageElement>>;

/* Cat Frames */
for (let i = 0; i < CAT_1_FRAME_NUM; i++) {
  imageFiles[`cat_1_${i}`] = loadImage(`/sprite/cat1/cathair${i}.png`);
}

for (let i = 0; i < CAT_2_FRAME_NUM; i++) {
  imageFiles[`cat_2_${i}`] = loadImage(`/sprite/cat2/cat${i}.png`);
}

for (let i = 0; i < CAT_3_FRAME_NUM; i++) {
  imageFiles[`cat_3_${i}`] = loadImage(`/sprite/cat3/baldcat${i}.png`);
}

async function loadMusic() {
  return await resolveObject(audioFiles);
}

async function loadImages() {
  return await resolveObject(imageFiles);
}

export class Game {
  // Lifecycle and time
  private last_timestamp: number = 0;
  private _stop: boolean = false;

  // gameContext
  private gameContext: GameContext = {
    theme: "cat",
    game_objects: [],
    debug: false,
    missed_note_count: 0,
    t: 0,
    sound: {},
    images: {},
    audio_ctx: audioContext,
    input: {
      pressedSpace: false,
      usedSpcae: false,
    },
  };

  // Drawing
  private canvas: HTMLCanvasElement | null = null;

  public screenChangeFunction: (screen: string) => void = () => {};

  constructor() {
    this.last_timestamp = performance.now();
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.gameContext.input.pressedSpace = true;
      }
    });
  }

  // Music
  private background_music: AudioBufferSourceNode | null = null;

  async init() {
    // Load all sounds and add them to the gameContext
    const sounds = await loadMusic();
    const images = await loadImages();
    this.gameContext.sound = sounds;
    this.gameContext.images = images;
    this.initScenes();
  }

  initScenes() {
    const scenes = generateScenes();

    for (const scene of scenes) {
      this.gameContext.game_objects.push(scene);
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // Lifecycle
  resume() {
    this._stop = false;
    this.last_timestamp = performance.now();
    this.playBackground(
      this.gameContext.audio_ctx,
      this.gameContext.sound.game_music
    );
    requestAnimationFrame(() => this.loop());
  }

  pause() {
    this._stop = true;
  }

  reset() {
    this.gameContext.t = 0;
    this.gameContext.missed_note_count = 0;
    this.gameContext.input.pressedSpace = false;
    this.gameContext.input.usedSpcae = false;
  }

  test() {
    this.canvas?.getContext("2d")?.fillRect(0, 0, 100, 100);
  }

  updateGameTime() {
    const now = performance.now();
    const delta = now - this.last_timestamp;
    this.last_timestamp = now;
    this.gameContext.t += delta;
  }

  processGameObjects() {
    for (const gameObject of this.gameContext.game_objects) {
      gameObject.tick(this.gameContext);
    }
  }

  playBackground(audio_ctx: AudioContext, buffer: AudioBuffer) {
    try {
      this.background_music?.stop();
    } catch (e) {}
    this.background_music = audio_ctx.createBufferSource();
    this.background_music.buffer = buffer;
    this.background_music.connect(audio_ctx.destination);
    this.background_music.loop = true;
    this.background_music.start();
  }

  drawGameObjects() {
    const draw_ctx = this.canvas!.getContext("2d")!;
    for (const gameObject of this.gameContext.game_objects) {
      gameObject.draw_bg(draw_ctx, this.gameContext);
    }

    for (const gameObject of this.gameContext.game_objects) {
      gameObject.draw_middle(draw_ctx, this.gameContext);
    }

    for (const gameObject of this.gameContext.game_objects) {
      gameObject.draw_front(draw_ctx, this.gameContext);
    }

    // too lazy to do this properly, target

    // debug
    if (this.gameContext.debug) {
      const ctx = this.canvas!.getContext("2d")!;
      ctx.font = "16px Arial";
      ctx.fillText(`t: ${this.gameContext.t}`, 10, 1000);
      ctx.fillText(
        `missedNoteCount: ${this.gameContext.missed_note_count}`,
        10,
        950
      );
    }
  }

  isLose() {
    return this.gameContext.missed_note_count >= 3;
  }

  loop() {
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

    // clear input, TODO: fail the player if space pressed at wrong moment

    if (
      !this.gameContext.input.usedSpcae &&
      this.gameContext.input.pressedSpace
    ) {
      this.gameContext.missed_note_count += 1;
    }

    this.gameContext.input.usedSpcae = false;
    this.gameContext.input.pressedSpace = false;

    if (this.isLose()) {
      this.reset();
      this.screenChangeFunction("lose");
      this._stop = true;
    }

    if (this.gameContext.t > 24000) {
      this.screenChangeFunction("win");
    }

    // stop if needed
    if (this._stop) {
      return;
    }
    requestAnimationFrame(() => this.loop());
  }
}

export function createNewGame() {
  const game = new Game();
  //window.game = game;
  return game;
}
