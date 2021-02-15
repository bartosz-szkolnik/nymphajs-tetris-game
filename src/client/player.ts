import { EventEmitter, Matrix, Vec2 } from '@nymphajs/core';
import { Tetris } from './tetris';
import { createPiece } from './tetris-pieces';
import type { Piece } from './tetris-pieces';
import {
  CHANGE_POSITION,
  MATRIX_ROTATED,
  PlayerEvent,
  UPDATE_SCORE,
} from './events';
import { Serializable } from '@nymphajs/network';
import { SerializedPlayer } from '../shared-types';

export const DROP_SLOW = 1;
export const DROP_FAST = 0.05;

export class Player implements Serializable<SerializedPlayer> {
  private dropCounter = 0;
  dropInterval = DROP_SLOW;
  readonly events = new EventEmitter<PlayerEvent>();

  pos = new Vec2(0, 0);
  matrix = new Matrix<number>();
  score = 0;

  constructor(private tetris: Tetris) {
    this.reset();
  }

  serialize(): SerializedPlayer {
    return {
      pos: this.pos.serialize(),
      matrix: this.matrix.grid,
      score: this.score,
    };
  }

  deserialize(data: SerializedPlayer) {
    this.pos = new Vec2(data.pos.x, data.pos.y);
    this.matrix.grid = data.matrix;
    this.score = data.score;
  }

  move(dir: number) {
    this.pos.x += dir;
    if (this.tetris.arena.collide(this)) {
      this.pos.x -= dir;
      return;
    }
    this.events.emit(CHANGE_POSITION, this.pos);
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

    this.events.emit(MATRIX_ROTATED, this.matrix.grid);
  }

  drop() {
    this.pos.y++;
    this.dropCounter = 0;

    if (this.tetris.arena.collide(this)) {
      this.pos.y--;
      this.tetris.arena.merge(this);
      this.reset();
      this.score += this.tetris.arena.sweep();
      this.events.emit(UPDATE_SCORE, this.score);
      return;
    }

    this.events.emit(CHANGE_POSITION, this.pos);
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
      this.events.emit(UPDATE_SCORE, this.score);
    }

    this.events.emit(CHANGE_POSITION, this.pos);
    this.events.emit(MATRIX_ROTATED, this.matrix.grid);
  }
}
