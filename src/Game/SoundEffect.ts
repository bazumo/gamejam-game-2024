import { GameObject } from "./GameObject";
import { GameContext } from "./types";

export class SoundEffect extends GameObject {
  private started: boolean = false;

  private delay: number = 0;

  playSound(audio_ctx: AudioContext, buffer: AudioBuffer) {
    const source = audio_ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(audio_ctx.destination);
    source.start();
  }

  constructor(time: number, delay: number) {
    super(time);
    this.delay = delay;
  }

  tick(game_ctx: GameContext) {
    const { t, audio_ctx } = game_ctx;
    console.log("clap tick", t);
    if (!this.started) {
      if (this.delay < this.relativeTimeMs(game_ctx)) {
        this.started = true;
        this.playSound(audio_ctx, game_ctx.sound.clap);
      }
    }
  }

  draw(draw_ctx: CanvasRenderingContext2D, game_ctx: GameContext) {
    const x = this.relativeTimeMs(game_ctx) - this.delay;
    draw_ctx.fillStyle = "red";
    draw_ctx.fillRect(x, 0, 100, 100);
  }
}
