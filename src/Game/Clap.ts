import { GameObject } from "./GameObject";
import { OFFSET_TOP_TARGET } from "./game";
import { GameContext } from "./types";

export class Clap extends GameObject {
  private clap_state:
    | "idle"
    | "in_range_not_played"
    | "in_range_played"
    | "missed" = "idle";

  private delay: number = 0;
  private threshold: number = 100;

  private theme: string = "cat";

  constructor(delay: number, theme: string, threshold: number = 100) {
    super(0);
    this.delay = delay;
    this.threshold = threshold;
    this.theme = theme;
  }

  playSound(audio_ctx: AudioContext, buffer: AudioBuffer) {
    const source = audio_ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(audio_ctx.destination);
    source.start();
  }

  tick(game_ctx: GameContext) {
    const { t, audio_ctx } = game_ctx;

    if (this.clap_state === "idle") {
      if (t > this.start_time + this.delay - this.threshold) {
        this.clap_state = "in_range_not_played";
      }
    } else if (this.clap_state === "in_range_not_played") {
      if (
        t < this.start_time + this.delay + this.threshold &&
        game_ctx.input.pressedSpace
      ) {
        this.clap_state = "in_range_played";
        game_ctx.input.usedSpcae = true;
        this.playSound(audio_ctx, game_ctx.sound.clap);
      }
      if (t > this.start_time + this.delay + this.threshold) {
        this.clap_state = "missed";
        game_ctx.missed_note_count += 1;
      }
    }
  }

  get_clap_image(game_ctx: GameContext) {
    if (this.clap_state === "missed") {
      return game_ctx.images[`${this.theme}_button_fail`];
    } else if (this.clap_state === "in_range_played") {
      return game_ctx.images[`${this.theme}_button_success`];
    }
    return game_ctx.images[`${this.theme}_button_note`];
  }

  draw_front(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const offset_left = 800;
    const { t } = game_ctx;

    const image = this.get_clap_image(game_ctx);

    const x = this.start_time + this.delay - t + offset_left;

    if (this.clap_state === "in_range_played" || this.clap_state === "missed") {
      draw_ctx.drawImage(
        image,
        x - image.width / 4,
        OFFSET_TOP_TARGET,
        image.width / 2,
        image.height / 2
      );
    }

    if (game_ctx.debug) {
      draw_ctx.fillStyle = "red";
      draw_ctx.fillRect(
        x - this.threshold,
        OFFSET_TOP_TARGET,
        2 * this.threshold,
        10
      );

      draw_ctx.fillStyle = "green";
      draw_ctx.fillRect(x, OFFSET_TOP_TARGET, 5, 10);
    }

    draw_ctx.fillStyle = "purple";
    draw_ctx.fillRect(offset_left, OFFSET_TOP_TARGET, 2, 100);
  }
}
