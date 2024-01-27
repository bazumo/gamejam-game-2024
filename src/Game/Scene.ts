import { Clap } from "./Clap";
import { GameObject } from "./GameObject";
import { SoundEffect } from "./SoundEffect";
import { GameContext } from "./types";

export class Scene extends GameObject {
  private children: GameObject[] = [];
  private backgrounds: any;
  private sounds: any;

  constructor(
    time: number,
    backgrounds: any,
    rythm: any,
    isDemo: boolean = false
  ) {
    super(time);
    this.backgrounds = backgrounds;
    this.sounds = rythm;
    if (isDemo) {
      this.children = this.sounds.map((item: any) => {
        // using the delay as a cheat
        return new SoundEffect(time, item.time);
      });
    } else {
      this.children = this.sounds.map((item: any) => {
        // using the delay as a cheat
        return new Clap(item.time + time, item.threshold);
      });
    }
  }

  tick(game_ctx: GameContext) {
    this.children.forEach((child) => {
      child.tick(game_ctx);
    });
  }

  getCurrentBackground(game_ctx: GameContext) {
    const relativeTimeMs = this.relativeTimeMs(game_ctx);
    const current_background = this.backgrounds.find((item: any) => {
      return (
        item.start <= relativeTimeMs &&
        (!item.end || item.end >= relativeTimeMs)
      );
    });
    return current_background;
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
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
    this.children.forEach((child) => {
      child.draw(draw_ctx, game_ctx);
    });
  }
}

const fuchs_1_background = [
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

function createScene(time: number, bg: any, rythm: any) {
  return new Scene(time, bg, rythm);
}

export function generateScenes() {
  const sceneCombos = [
    {
      bg: fuchs_1_background,
      rythm: fuchs_1_1_rythm,
    },
    {
      bg: fuchs_1_background,
      rythm: fuchs_1_2_rythm,
    },
    {
      bg: fuchs_1_background,
      rythm: fuchs_1_3_rythm,
    },
  ];
  const scenes: any = [];
  let time = 0;
  sceneCombos.forEach((item) => {
    scenes.push(createScene(time, item.bg, item.rythm));
    time += 2000;
  });
  return scenes;
}
