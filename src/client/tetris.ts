import { Matrix, Timer, Vec2 } from '@nymphajs/core';
import { Serializable } from '@nymphajs/network';
import { SerializedTetris } from '../shared-types';
import { Arena } from './arena';
import { UPDATE_SCORE } from './events';
import { Player } from './player';
import { COLORS } from './tetris-pieces';

export class Tetris implements Serializable<SerializedTetris> {
  private readonly ctx = this.canvas.getContext('2d')!;

  readonly arena = new Arena();
  readonly player = new Player(this);

  constructor(
    public element: HTMLDivElement,
    private canvas: HTMLCanvasElement
  ) {
    this.updateScore(0);

    this.player.events.listen<number>(UPDATE_SCORE, (score) => {
      this.updateScore(score);
    });
  }

  serialize(): SerializedTetris {
    return {
      arena: this.arena.serialize(),
      player: this.player.serialize(),
    };
  }

  deserialize(data: SerializedTetris) {
    this.arena.deserialize(data.arena);
    this.player.deserialize(data.player);

    this.updateScore(data.player.score);
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawMatrix(this.arena.matrix, this.ctx, new Vec2(0, 0));
    this.drawMatrix(this.player.matrix, this.ctx, this.player.pos);
  }

  drawMatrix(
    matrix: Matrix<number>,
    ctx: CanvasRenderingContext2D,
    offset: Vec2
  ) {
    matrix.forEach((value, y, x) => {
      if (value === 0) {
        return;
      }

      ctx.fillStyle = COLORS[value];
      ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
    });
  }

  start() {
    const self = this;
    function update(deltaTime: number) {
      self.player.update(deltaTime);
      self.draw();
    }

    const timer = new Timer(1 / 60);
    timer.setUpdateFn(update);
    timer.start();
  }

  updateScore(score: number) {
    const container = this.canvas.parentElement?.parentElement!;
    const scoreCont = container!.querySelector('.score')! as HTMLSpanElement;
    scoreCont.innerText = String(score);
  }
}
