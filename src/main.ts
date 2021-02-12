import { CanvasModule } from '@nymphajs/dom-api';
import { setupKeyboard } from './input';
import { Tetris } from './tetris';

function main(canvas: HTMLCanvasElement) {
  canvas.width = 240;
  canvas.height = 400;

  const tetris = new Tetris(canvas);
  const input = setupKeyboard(tetris.player);
  input.listenTo(window);

  tetris.player.updateScore();
  tetris.start();
}

const canvasModule = new CanvasModule();
const { canvas } = canvasModule.init('canvas-container');

main(canvas);
