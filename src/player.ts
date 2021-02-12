import { Matrix, Vec2 } from '@nymphajs/core';
import { Tetris } from './tetris';
import { createPiece } from './tetris-pieces';
import type { Piece } from './tetris-pieces';

export const DROP_SLOW = 1;
export const DROP_FAST = 0.05;

export class Player {
  private dropCounter = 0;
  dropInterval = DROP_SLOW;

  pos = new Vec2(0, 0);
  matrix = new Matrix<number>();
  score = 0;

  constructor(private tetris: Tetris) {
    this.reset();
  }

  move(dir: number) {
    this.pos.x += dir;
    if (this.tetris.arena.collide(this)) {
      this.pos.x -= dir;
    }
  }

  rotate(dir: number) {
    const x = this.pos.x;
    let offset = 1;
    this.matrix.rotate(dir);

    while (this.tetris.arena.collide(this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix.getCol(0).length) {
        this.matrix.rotate(-dir);
        this.pos.x = x;
        return;
      }
    }
  }

  drop() {
    this.pos.y++;
    if (this.tetris.arena.collide(this)) {
      this.pos.y--;
      this.tetris.arena.merge(this);
      this.reset();
      this.score += this.tetris.arena.sweep();
      this.tetris.updateScore(this.score);
    }

    this.dropCounter = 0;
  }

  update(deltaTime: number) {
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }

  reset() {
    const pieces = 'ILJOTSZ';
    const pieceType = pieces[(pieces.length * Math.random()) | 0] as Piece;
    this.matrix = Matrix.fromArray(createPiece(pieceType));

    const x =
      ((this.tetris.arena.matrix.getCol(0).length / 2) | 0) -
      ((this.matrix.getCol(0).length / 2) | 0);
    this.pos.set(x, 0);

    if (this.tetris.arena.collide(this)) {
      this.tetris.arena.clear();
      this.score = 0;
      this.tetris.updateScore(0);
    }
  }
}
