import { CanvasModule } from '@nymphajs/dom-api';
import { setupKeyboard, setupSecondKeyboard } from './input';
import { Player } from './player';
import { Tetris } from './tetris';

function setupKeyboardFor(player: Player, isSecond: boolean) {
  if (!isSecond) {
    return setupKeyboard(player);
  }

  return setupSecondKeyboard(player);
}

function main(canvas: HTMLCanvasElement, isSecond: boolean) {
  canvas.width = 240;
  canvas.height = 400;

  const tetris = new Tetris(canvas);
  const input = setupKeyboardFor(tetris.player, isSecond);
  input.listenTo(window);

  tetris.start();
}

const canvasModule = new CanvasModule();
const players = document.querySelectorAll('.player');
[...players].forEach((player, i) => {
  const canvasContainer = player.querySelector('.canvas-container')!;
  const { canvas } = canvasModule.init(canvasContainer);

  main(canvas, i === 1);
});
