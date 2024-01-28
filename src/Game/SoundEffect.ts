import { GameObject } from "./GameObject";
import { GameContext } from "./types";

export class SoundEffect extends GameObject {
  private has_started: boolean = false;
  private clap_time: number = 0;

  private theme: string = "cat";

  playSound(audio_ctx: AudioContext, buffer: AudioBuffer) {
    const source = audio_ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(audio_ctx.destination);
    source.start();
  }

  constructor(clap_time: number, theme: string) {
    super(clap_time);
    this.clap_time = clap_time;
    this.theme = theme;
  }

  tick(game_ctx: GameContext) {
    const { t, audio_ctx } = game_ctx;

    if (t > this.clap_time && !this.has_started) {
      this.playSound(audio_ctx, game_ctx.sound.clap);
      this.has_started = true;
    }
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const offset_left = 800;
    const { t } = game_ctx;

    const image = game_ctx.images[`${this.theme}_button_note`];

    const x = this.clap_time - t + offset_left;

    draw_ctx.drawImage(
      image,
      x - image.width / 4,
      0,
      image.width / 2,
      image.height / 2
    );

    if (game_ctx.debug) {
      draw_ctx.fillStyle = "green";
      draw_ctx.fillRect(x, 0, 5, 10);
    }

    draw_ctx.fillStyle = "purple";
    draw_ctx.fillRect(offset_left, 0, 2, 100);
  }
}
