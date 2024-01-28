import { Clap } from "./Clap";
import { GameObject } from "./GameObject";
import { SoundEffect } from "./SoundEffect";
import { OFFSET_TOP_TARGET } from "./game";
import {
  CAT_1_FRAME_NUM,
  CAT_2_FRAME_NUM,
  CAT_3_FRAME_NUM,
  GameContext,
} from "./types";

interface Frame {
  start: number;
  end?: number;
  images: string[];
}

const TARGET_LENGTH = 2000;

function genFramesCat(sprite_id: string, frame_num: number) {
  const frame_len = TARGET_LENGTH / frame_num;
  return Array(frame_num)
    .fill(0)
    .map((_, index) => {
      return {
        start: index * frame_len,
        end: index * frame_len + frame_len,
        images: [`${sprite_id}_${index}`],
      };
    });
}

const frames = {
  cat_1: genFramesCat("cat_1", CAT_1_FRAME_NUM),
  cat_2: genFramesCat("cat_2", CAT_2_FRAME_NUM),
  cat_3: genFramesCat("cat_3", CAT_3_FRAME_NUM),
  fuchs_1: create_fox_frames(),
  fuchs_2: create_fox_frames(),
  fuchs_3: create_fox_frames(false),
} as Record<string, Frame[]>;

// polish fox

frames.fuchs_2[frames.fuchs_2.length - 1].images = [
  "fuchs1_17",
  "chicken_right_7",
  "chicken_left_3",
];
frames.fuchs_2[frames.fuchs_2.length - 1].images = [
  "fuchs1_16",
  "chicken_right_16",
  "chicken_left_13",
];
frames.fuchs_2[frames.fuchs_2.length - 1].images = [
  "fuchs1_3",
  "chicken_left_13",
];

frames.fuchs_3[frames.fuchs_2.length - 1].images = [
  "fuchs1_19",
  "chicken_left_3",
];
frames.fuchs_3[frames.fuchs_2.length - 1].images = [
  "fuchs1_18",
  "chicken_left_16",
];
frames.fuchs_3[frames.fuchs_2.length - 1].images = ["fuchs1_3"];

console.log(frames);
export class CatBackground extends GameObject {
  private frames: Frame[];
  public length: number = 0;

  constructor(frames: Frame[]) {
    super(0);
    this.frames = frames;
    this.length = this.frames.reduce((acc, item) => {
      return Math.max(acc, item.end || 0);
    }, 0);
  }

  getCurrentBackground(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const t = relativeTimeMs % this.length;

    const current_background = this.frames.find((item) => {
      return item.start <= t && (!item.end || item.end >= t);
    });
    return current_background;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(game_ctx: GameContext): void {}
  draw_bg(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext): void {
    draw_ctx.drawImage(game_ctx.images["cat_bg"], 0, 0, 1920, 1080);

    const current_background = this.getCurrentBackground(game_ctx);
    if (current_background) {
      for (let i = 0; i < current_background.images.length; i++) {
        draw_ctx.drawImage(
          game_ctx.images[current_background.images[i]],
          0,
          0,
          1920,
          1080
        );
      }
    }
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_fox_frames(
  left_chicken: boolean = true,
  right_chicken: boolean = true
): Frame[] {
  const NUM_CHOICES = 15;
  const NUM_FRAMES = 16;
  const FRAME_LENGTH = 2000 / NUM_FRAMES;
  return Array(NUM_FRAMES)
    .fill(0)
    .map((_, index) => {
      const choice_fox = getRandomInt(0, NUM_CHOICES);
      const choice_left = getRandomInt(0, NUM_CHOICES);
      const choice_right = getRandomInt(0, NUM_CHOICES);
      const frame = {
        start: index * FRAME_LENGTH,
        end: index * FRAME_LENGTH + FRAME_LENGTH,
        images: [`fuchs1_${choice_fox}`],
      };
      if (left_chicken) {
        frame.images.push(`chicken_left_${choice_left}`);
      }
      if (right_chicken) {
        frame.images.push(`chicken_right_${choice_right}`);
      }
      return frame;
    });
}

export class FoxBackground extends GameObject {
  private frames: Frame[];
  public length: number = 0;

  constructor(frames: Frame[]) {
    super(0);
    this.frames = frames;
    this.length = this.frames.reduce((acc, item) => {
      return Math.max(acc, item.end || 0);
    }, 0);
  }

  getCurrentBackground(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const t = relativeTimeMs % this.length;

    const current_background = this.frames.find((item) => {
      return item.start <= t && (!item.end || item.end >= t);
    });
    return current_background;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(game_ctx: GameContext): void {}
  draw_bg(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext): void {
    const index =
      Math.abs(Math.floor(this.relativeTimeMs(game_ctx) / this.frames.length)) %
      2;
    draw_ctx.drawImage(game_ctx.images[`fuchs_bg_${index}`], 0, 0, 1920, 1080);

    const current_background = this.getCurrentBackground(game_ctx);
    if (current_background) {
      for (let i = 0; i < current_background.images.length; i++) {
        const image = current_background.images[i];
        draw_ctx.drawImage(game_ctx.images[image], 0, 0, 1920, 1080);
      }
    }
  }
}

export class Scene extends GameObject {
  private children: GameObject[] = [];
  private theme: string;

  constructor(time: number, theme: string, children: GameObject[] = []) {
    super(time);
    this.theme = theme;

    this.children = [...this.children, ...children];

    // HACK
    this.children.forEach((child) => {
      child.set_start_time(time);
    });
  }

  tick(game_ctx: GameContext) {
    if (!this.isActive(game_ctx, 1000)) {
      return;
    }
    game_ctx.theme = this.theme;
    this.children.forEach((child) => {
      child.tick(game_ctx);
    });
  }

  getLength() {
    // HACK, once demo once test
    return TARGET_LENGTH * 2;
  }

  isActive(game_ctx: GameContext, offset: number = 0) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const is_active =
      relativeTimeMs >= 0 && relativeTimeMs <= this.getLength() + offset;

    return is_active;
  }

  draw_bg(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    if (this.isActive(game_ctx)) {
      this.children.forEach((child) => {
        child.draw_bg(draw_ctx, game_ctx);
      });
    }
  }

  draw_middle(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    if (this.isActive(game_ctx)) {
      this.children.forEach((child) => {
        child.draw_middle(draw_ctx, game_ctx);
      });
    }
  }

  draw_front(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    if (this.isActive(game_ctx)) {
      this.children.forEach((child) => {
        child.draw_front(draw_ctx, game_ctx);
      });

      const t = this.relativeTimeMs(game_ctx);

      const x = t % (this.getLength() / 2);
      const isTest = Math.floor(t / (this.getLength() / 2)) % 2 === 0;

      const MAX_LEN = 1920;
      const MARGIN = 100;
      const INNER_LENGTH = MAX_LEN - 2 * MARGIN;
      const IMAGE_OFFSET_LEFT = MARGIN + (INNER_LENGTH / 2000) * x;

      const image = game_ctx.images[`${this.theme}_button_outline`];

      draw_ctx.drawImage(
        image,
        IMAGE_OFFSET_LEFT,
        OFFSET_TOP_TARGET + (isTest ? 0 : 140),
        image.width / 2,
        image.height / 2
      );
    }
  }
}

const EIGHTH_NOTE = 250;
const QUARTER_NOTE = 500;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HALF_NOTE = 1000;

const notes_to_rythm = (notes: number[]) => {
  let t = 0;
  return notes.map((note) => {
    t += note;
    return {
      time: t,
      sound: "clap",
    };
  });
};

const cat_1_rythm = notes_to_rythm([
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  HALF_NOTE,
]);
const cat_2_rythm = notes_to_rythm([
  HALF_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
]);
const cat_3_rythm = notes_to_rythm([
  QUARTER_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE,
  EIGHTH_NOTE,
]);

const fuchs_1_rythm = notes_to_rythm([
  QUARTER_NOTE,
  EIGHTH_NOTE,
  HALF_NOTE,
  EIGHTH_NOTE,
]);

const fuchs_2_rythm = notes_to_rythm([HALF_NOTE, QUARTER_NOTE, QUARTER_NOTE]);

const fuchs_3_rythm = notes_to_rythm([
  QUARTER_NOTE,
  QUARTER_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  EIGHTH_NOTE,
]);

const rythms = {
  cat_1: cat_1_rythm,
  cat_2: cat_2_rythm,
  cat_3: cat_3_rythm,
  fuchs_1: fuchs_1_rythm,
  fuchs_2: fuchs_2_rythm,
  fuchs_3: fuchs_3_rythm,
} as Record<string, typeof cat_1_rythm>;

function rythm_to_gameObjects(rythm: typeof cat_1_rythm, theme: string) {
  // HACK
  const objs = [
    ...rythm.map((item) => {
      // using the delay as a cheat
      return new SoundEffect(item.time, theme);
    }),
    ...rythm.map((item) => {
      // using the delay as a cheat
      return new Clap(item.time + TARGET_LENGTH, theme);
    }),
  ];
  return objs;
}

const backgrounds = {
  cat_1: new CatBackground(frames.cat_1),
  cat_2: new CatBackground(frames.cat_2),
  cat_3: new CatBackground(frames.cat_3),
  fuchs_1: new FoxBackground(frames.fuchs_1),
  fuchs_2: new FoxBackground(frames.fuchs_2),
  fuchs_3: new FoxBackground(frames.fuchs_3),
} as Record<string, CatBackground | FoxBackground>;

function genScene(theme: string, stage: number) {
  const scene = {
    theme,
    children: [
      backgrounds[`${theme}_${stage}`],
      ...rythm_to_gameObjects(rythms[`${theme}_${stage}`], theme),
    ],
  };
  console.log(scene);
  return scene;
}

const sceneCombos = [
  genScene("cat", 1),
  genScene("fuchs", 1),
  genScene("cat", 2),
  genScene("fuchs", 2),
  genScene("cat", 3),
  genScene("fuchs", 3),
];

export function generateScenes() {
  const scenes: Scene[] = [];
  let time = 0;
  sceneCombos.forEach((item) => {
    const scene = new Scene(time, item.theme, item.children);

    scenes.push(scene);
    time += scene.getLength();
  });
  return scenes;
}
