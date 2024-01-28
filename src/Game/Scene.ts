import { Clap } from "./Clap";
import { GameObject } from "./GameObject";
import { SoundEffect } from "./SoundEffect";
import { GameContext } from "./types";

export class CatBackground extends GameObject {
  private frames = Array(32)
    .fill(0)
    .map((_, index) => {
      return {
        start: index * 125,
        end: index * 125 + 125,
        image: `cathair_1_${index}`,
      };
    });

  public length = this.frames.reduce((acc, item) => {
    return Math.max(acc, item.end || 0);
  }, 0);

  getCurrentBackground(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const current_background = this.frames.find((item) => {
      return (
        item.start <= relativeTimeMs &&
        (!item.end || item.end >= relativeTimeMs)
      );
    });
    return current_background;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(game_ctx: GameContext): void {}
  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext): void {
    const current_background = this.getCurrentBackground(game_ctx);
    if (current_background) {
      draw_ctx.drawImage(
        game_ctx.images[current_background.image],
        0,
        0,
        1920,
        1080
      );
    }
  }
}

export class FoxBackground extends GameObject {
  private frames = [
    {
      start: 0,
      end: 500,
      image: "fuchs1_1",
    },
    {
      start: 500,
      end: 1000,
      image: "fuchs1_2",
    },
    {
      start: 1000,
      end: 1500,
      image: "fuchs1_3",
    },
    {
      start: 1500,
      end: 2000,
      image: "fuchs1_4",
    },
  ];

  public length = this.frames.reduce((acc, item) => {
    return Math.max(acc, item.end || 0);
  }, 0);

  getCurrentBackground(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const current_background = this.frames.find((item) => {
      return (
        item.start <= relativeTimeMs &&
        (!item.end || item.end >= relativeTimeMs)
      );
    });
    return current_background;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(game_ctx: GameContext): void {}
  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext): void {
    const current_background = this.getCurrentBackground(game_ctx);
    if (current_background) {
      draw_ctx.drawImage(
        game_ctx.images[current_background.image],
        0,
        0,
        1920,
        1080
      );
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
    if (!this.isActive(game_ctx)) {
      return;
    }
    game_ctx.theme = this.theme;
    this.children.forEach((child) => {
      child.tick(game_ctx);
    });
  }

  getLength() {
    return this.children.reduce((acc, item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Math.max(acc, (item as any).length ?? 0);
    }, 0);
  }

  isActive(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    return relativeTimeMs >= 0 && relativeTimeMs <= this.getLength() + 1000;
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    this.children.forEach((child) => {
      child.draw(draw_ctx, game_ctx);
    });
  }
}

const EIGHTH_NOTE = 250;
const QUARTER_NOTE = 500;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HALF_NOTE = 1000;

const cat_1_notes = [
  QUARTER_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE, // Pattern 1, 4 quarter notes
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE, // Pattern 2, 4 quarter notes
  /*QUARTER_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE, // Pattern 3, 4 quarter notes
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE, // Pattern 4, 4 quarter notes
  HALF_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE, // Pattern 5, 4 quarter notes (half note used here)
  QUARTER_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE, // Pattern 6, 4 quarter notes
  QUARTER_NOTE,
  EIGHTH_NOTE,
  EIGHTH_NOTE,
  QUARTER_NOTE,
  QUARTER_NOTE, // Pattern 7, 4 quarter notes
  QUARTER_NOTE,
  QUARTER_NOTE,
  HALF_NOTE, // Pattern 8, 4 quarter notes (half note used here)*/
];

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

const cat_1_rythm = notes_to_rythm(cat_1_notes);

const fuchs_1_1_rythm = [
  {
    time: 250,

    sound: "clap",
  },
  {
    time: 750,

    sound: "clap",
  },
  {
    time: 1000,
    sound: "clap",
  },
  {
    time: 1500,
    sound: "clap",
  },
  {
    time: 2000,

    sound: "clap",
  },
];

const fuchs_1_2_rythm = [
  {
    time: 500,

    sound: "clap",
  },
  {
    time: 750,

    sound: "clap",
  },
  {
    time: 1000,

    sound: "clap",
  },
  {
    time: 1500,
    sound: "clap",
  },
  {
    time: 2000,

    sound: "clap",
  },
];

const fuchs_1_3_rythm = [
  {
    time: 250,

    sound: "clap",
  },
  {
    time: 750,

    sound: "clap",
  },
  {
    time: 1000,

    sound: "clap",
  },
  {
    time: 1250,

    sound: "clap",
  },
  {
    time: 1500,
    sound: "clap",
  },
  {
    time: 2000,

    sound: "clap",
  },
];

function rythm_to_gameObjects(
  rythm: typeof cat_1_rythm,
  theme: string,
  isDemo: boolean = false
) {
  if (isDemo) {
    return rythm.map((item) => {
      // using the delay as a cheat
      return new SoundEffect(item.time, theme);
    });
  } else {
    return rythm.map((item) => {
      // using the delay as a cheat
      return new Clap(item.time, theme);
    });
  }
}

export function generateScenes() {
  const sceneCombos = [
    {
      rythm: cat_1_rythm,
      theme: "cat",
      children: [
        new CatBackground(0),
        ...rythm_to_gameObjects(cat_1_rythm, "cat"),
      ],
    },
    {
      rythm: fuchs_1_1_rythm,
      theme: "duck",
      children: [
        new FoxBackground(0),
        ...rythm_to_gameObjects(fuchs_1_1_rythm, "duck"),
      ],
    },
    {
      rythm: fuchs_1_2_rythm,
      theme: "duck",
      children: [
        new FoxBackground(0),
        ...rythm_to_gameObjects(fuchs_1_2_rythm, "duck"),
      ],
    },
    {
      rythm: fuchs_1_3_rythm,
      theme: "duck",
      children: [
        new FoxBackground(0),
        ...rythm_to_gameObjects(fuchs_1_3_rythm, "duck"),
      ],
    },
  ];

  const scenes: Scene[] = [];
  let time = 0;
  sceneCombos.forEach((item) => {
    const scene = new Scene(time, item.theme, item.children);

    scenes.push(scene);
    time += scene.getLength();
  });
  return scenes;
}
