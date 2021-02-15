import { EventEmitter, Matrix } from '@nymphajs/core';
import type { Player } from './player';
import { ArenaEvent, MATRIX_CHANGED } from './events';
import { Serializable } from '@nymphajs/network';
import { SerializedArena } from '../shared-types';

const ARENA_WIDTH = 12;
const ARENA_HEIGHT = 20;

export class Arena implements Serializable<SerializedArena> {
  readonly matrix = this.createMatrix(ARENA_WIDTH, ARENA_HEIGHT);
  readonly events = new EventEmitter<ArenaEvent>();

  serialize() {
    return {
      matrix: this.matrix.grid,
    };
  }

  deserialize(data: SerializedArena) {
    this.matrix.grid = data.matrix;
  }

  sweep() {
    let rowCount = 1;
    let score = 0;
    outer: for (let y = this.matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < this.matrix.grid[y].length; ++x) {
        if (this.matrix.get(y, x) === 0) {
          continue outer;
        }
      }

      const row = this.matrix.grid.splice(y, 1)[0].fill(0);
      this.matrix.grid.unshift(row);
      ++y;

      score += rowCount * 10;
      rowCount *= 2;
    }

    this.events.emit(MATRIX_CHANGED, this.matrix.grid);
    return score;
  }

  merge(player: Player) {
    player.matrix.forEach((value, y, x) => {
      if (value !== 0) {
        this.matrix.set(y + player.pos.y, x + player.pos.x, value);
      }
    });

    this.events.emit(MATRIX_CHANGED, this.matrix.grid);
  }

  clear() {
    this.matrix.grid.forEach((row) => row.fill(0));
    this.events.emit(MATRIX_CHANGED, this.matrix.grid);
  }

  collide(player: Player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m.getCol(y).length; ++x) {
        if (m.get(y, x) !== 0 && this.matrix.get(y + o.y, x + o.x) !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  private createMatrix(width: number, height: number) {
    const array = [];
    while (height--) {
      array.push(new Array(width).fill(0));
    }

    return Matrix.fromArray<number>(array);
  }
}
