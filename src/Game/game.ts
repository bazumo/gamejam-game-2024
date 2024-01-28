import { generateScenes } from "./Scene";
import { GameContext } from "./types";

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
};

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

  cathair_1_0: loadImage("/sprite/cat1/cathair0.png"),
  cathair_1_1: loadImage("/sprite/cat1/cathair1.png"),
  cathair_1_2: loadImage("/sprite/cat1/cathair2.png"),
  cathair_1_3: loadImage("/sprite/cat1/cathair3.png"),
  cathair_1_4: loadImage("/sprite/cat1/cathair4.png"),
  cathair_1_5: loadImage("/sprite/cat1/cathair5.png"),
  cathair_1_6: loadImage("/sprite/cat1/cathair6.png"),
  cathair_1_7: loadImage("/sprite/cat1/cathair7.png"),
  cathair_1_8: loadImage("/sprite/cat1/cathair8.png"),
  cathair_1_9: loadImage("/sprite/cat1/cathair9.png"),
  cathair_1_10: loadImage("/sprite/cat1/cathair10.png"),
  cathair_1_11: loadImage("/sprite/cat1/cathair11.png"),
  cathair_1_12: loadImage("/sprite/cat1/cathair12.png"),
  cathair_1_13: loadImage("/sprite/cat1/cathair13.png"),
  cathair_1_14: loadImage("/sprite/cat1/cathair14.png"),
  cathair_1_15: loadImage("/sprite/cat1/cathair15.png"),
  cathair_1_16: loadImage("/sprite/cat1/cathair16.png"),
  cathair_1_17: loadImage("/sprite/cat1/cathair17.png"),
  cathair_1_18: loadImage("/sprite/cat1/cathair18.png"),
  cathair_1_19: loadImage("/sprite/cat1/cathair19.png"),
  cathair_1_20: loadImage("/sprite/cat1/cathair20.png"),
  cathair_1_21: loadImage("/sprite/cat1/cathair21.png"),
  cathair_1_22: loadImage("/sprite/cat1/cathair22.png"),
  cathair_1_23: loadImage("/sprite/cat1/cathair23.png"),
  cathair_1_24: loadImage("/sprite/cat1/cathair24.png"),
  cathair_1_25: loadImage("/sprite/cat1/cathair25.png"),
  cathair_1_26: loadImage("/sprite/cat1/cathair26.png"),
  cathair_1_27: loadImage("/sprite/cat1/cathair27.png"),
  cathair_1_28: loadImage("/sprite/cat1/cathair28.png"),
  cathair_1_29: loadImage("/sprite/cat1/cathair29.png"),
  cathair_1_30: loadImage("/sprite/cat1/cathair30.png"),
  cathair_1_31: loadImage("/sprite/cat1/cathair31.png"),

  cat_button_outline: loadImage("/sprite/button cat2.png"),
  duck_button_outline: loadImage("/sprite/button duck2.png"),

  cat_button_fail: loadImage("/sprite/button cat3.png"),
  duck_button_fail: loadImage("/sprite/button duck3.png"),

  cat_button_note: loadImage("/sprite/button cat0.png"),
  duck_button_note: loadImage("/sprite/button duck0.png"),

  cat_bg: loadImage("/sprite/background/cat bg.png"),
};

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
    debug: true,
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

  constructor() {
    this.last_timestamp = performance.now();
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.gameContext.input.pressedSpace = true;
      }
    });
  }

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

  drawGameObjects() {
    const draw_ctx = this.canvas!.getContext("2d")!;
    for (const gameObject of this.gameContext.game_objects) {
      gameObject.draw(draw_ctx, this.gameContext);
    }

    // too lazy to do this properly

    const image =
      this.gameContext.images[`${this.gameContext.theme}_button_outline`];

    draw_ctx.drawImage(
      image,
      800 - image.width / 4,
      0,
      image.width / 2,
      image.height / 2
    );

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
