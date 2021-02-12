import { KeyboardState } from '@nymphajs/dom-api';
import { Player } from './player';

const SPACE = 'Space';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';
const KEY_Q = 'KeyQ';
const KEY_W = 'KeyW';

export function setupKeyboard(player: Player) {
  const input = new KeyboardState(false);

  input.addMapping(SPACE, (keyState) => {});

  input.addMapping(ARROW_RIGHT, (keyState) => {
    if (keyState === 1) {
      player.move(1);
    }
  });

  input.addMapping(ARROW_LEFT, (keyState) => {
    if (keyState === 1) {
      player.move(-1);
    }
  });

  input.addMapping(ARROW_DOWN, (keyState) => {
    if (keyState === 1) {
      player.drop();
    }
  });

  input.addMapping(KEY_Q, (keyState) => {
    if (keyState === 1) {
      player.rotate(-1);
    }
  });

  input.addMapping(KEY_W, (keyState) => {
    if (keyState === 1) {
      player.rotate(1);
    }
  });

  return input;
}
