import { GameObject } from "./GameObject";
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

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const offset_left = 800;
    const { t } = game_ctx;

    const image =
      "missed" === this.clap_state
        ? game_ctx.images[`${this.theme}_button_fail`]
        : game_ctx.images[`${this.theme}_button_note`];

    const x = this.start_time + this.delay - t + offset_left;

    draw_ctx.drawImage(
      image,
      x - image.width / 4,
      0,
      image.width / 2,
      image.height / 2
    );

    if (game_ctx.debug) {
      draw_ctx.fillStyle = "red";
      draw_ctx.fillRect(x - this.threshold, 0, 2 * this.threshold, 10);

      draw_ctx.fillStyle = "green";
      draw_ctx.fillRect(x, 0, 5, 10);
    }

    draw_ctx.fillStyle = "purple";
    draw_ctx.fillRect(offset_left, 0, 2, 100);
  }
}
