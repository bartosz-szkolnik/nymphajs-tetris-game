import { KeyboardState, PRESSED } from '@nymphajs/dom-api';
import { DROP_FAST, DROP_SLOW, Player } from './player';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';
const KEY_Q = 'KeyQ';
const KEY_W = 'KeyW';
const KEY_E = 'KeyE';
const KEY_A = 'KeyA';
const KEY_D = 'KeyD';
const KEY_S = 'KeyS';
const KEY_O = 'KeyO';
const KEY_P = 'KeyP';

export function setupKeyboard(player: Player) {
  const input = new KeyboardState(false);

  input.addMapping(KEY_D, (keyState) => {
    if (keyState === PRESSED) {
      player.move(1);
    }
  });

  input.addMapping(KEY_A, (keyState) => {
    if (keyState === PRESSED) {
      player.move(-1);
    }
  });

  input.addMapping(KEY_Q, (keyState) => {
    if (keyState === PRESSED) {
      player.rotate(-1);
    }
  });

  input.addMapping(KEY_E, (keyState) => {
    if (keyState === PRESSED) {
      player.rotate(1);
    }
  });

  input.addMapping(KEY_S, (keyState) => {
    player.drop();
  });

  return input;
}

export function setupSecondKeyboard(player: Player) {
  const input = new KeyboardState(false);

  input.addMapping(ARROW_RIGHT, (keyState) => {
    if (keyState === PRESSED) {
      player.move(1);
    }
  });

  input.addMapping(ARROW_LEFT, (keyState) => {
    if (keyState === PRESSED) {
      player.move(-1);
    }
  });

  input.addMapping(KEY_O, (keyState) => {
    if (keyState === PRESSED) {
      player.rotate(-1);
    }
  });

  input.addMapping(KEY_P, (keyState) => {
    if (keyState === PRESSED) {
      player.rotate(1);
    }
  });

  input.addMapping(ARROW_DOWN, (keyState) => {
    if (keyState === PRESSED) {
      if (player.dropInterval !== DROP_FAST) {
        player.drop();
        player.dropInterval = DROP_FAST;
      }
    } else {
      player.dropInterval = DROP_SLOW;
    }
  });

  return input;
}
