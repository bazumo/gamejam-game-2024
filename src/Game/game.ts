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
  fuchs1_1: loadImage("/sprite/fuch1/fuch1.png"),
  fuchs1_2: loadImage("/sprite/fuch1/fuch5.png"),
  fuchs1_3: loadImage("/sprite/fuch1/fuch6.png"),
  fuchs1_4: loadImage("/sprite/fuch1/fuch7.png"),
  fuchs1_5: loadImage("/sprite/fuch1/fuch8.png"),
  fuchs1_6: loadImage("/sprite/fuch1/fuch9.png"),
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
    game_objects: [],
    debug: true,
    missed_note: false,
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
    this.gameContext.missed_note = false;
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
    console.log("gameTime", this.gameContext.t);
  }

  processGameObjects() {
    for (const gameObject of this.gameContext.game_objects) {
      gameObject.tick(this.gameContext);
    }
  }

  drawGameObjects() {
    for (const gameObject of this.gameContext.game_objects) {
      gameObject.draw(this.canvas!.getContext("2d")!, this.gameContext);
    }
    // debug
    if (this.gameContext.debug) {
      const ctx = this.canvas!.getContext("2d")!;
      ctx.font = "16px Arial";
      ctx.fillText(`t: ${this.gameContext.t}`, 10, 1000);
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

    // clear input, TODO: fail the player if space pressed at wrong moment

    if (
      !this.gameContext.input.usedSpcae &&
      this.gameContext.input.pressedSpace
    ) {
      this.gameContext.missed_note = true;
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
