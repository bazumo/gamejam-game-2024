import { GameObject } from "./GameObject";
import { GameContext } from "./types";

export class Clap extends GameObject {
  private clap_state:
    | "idle"
    | "in_range_not_played"
    | "in_range_played"
    | "missed" = "idle";

  private clap_time: number = 0;
  private threshold: number = 100;

  constructor(clap_time: number, threshold: number = 100) {
    super(clap_time);
    this.clap_time = clap_time;
    this.threshold = threshold;
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
      if (t > this.clap_time - this.threshold) {
        this.clap_state = "in_range_not_played";
      }
    } else if (this.clap_state === "in_range_not_played") {
      if (t < this.clap_time + this.threshold && game_ctx.input.pressedSpace) {
        this.clap_state = "in_range_played";
        game_ctx.input.usedSpcae = true;
        this.playSound(audio_ctx, game_ctx.sound.clap);
      }
      if (t > this.clap_time + this.threshold) {
        this.clap_state = "missed";
        game_ctx.missed_note = true;
      }
    }
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const offset_left = 200;
    const { t } = game_ctx;
    if (game_ctx.debug) {
      const x = this.clap_time - t + offset_left;

      draw_ctx.fillStyle = "red";
      draw_ctx.fillRect(x - this.threshold, 0, 2 * this.threshold, 100);

      draw_ctx.fillStyle = "green";
      draw_ctx.fillRect(x, 0, 5, 100);

      draw_ctx.fillStyle = "black";
      draw_ctx.fillText(this.clap_state, x, 100);

      draw_ctx.fillStyle = "purple";
      draw_ctx.fillRect(offset_left, 0, 2, 100);
    }
  }
}
