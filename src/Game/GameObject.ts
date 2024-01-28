import { GameContext } from "./types";

export abstract class GameObject {
  public start_time: number;
  constructor(start_time: number) {
    this.start_time = start_time;
  }

  set_start_time(start_time: number) {
    this.start_time = start_time;
  }

  relativeTimeMs(game_ctx: GameContext): number {
    return game_ctx.t - this.start_time;
  }

  abstract tick(game_ctx: GameContext): void;

  abstract draw(
    draw_ctx: CanvasRenderingContext2D,
    game_ctx: GameContext
  ): void;
}
