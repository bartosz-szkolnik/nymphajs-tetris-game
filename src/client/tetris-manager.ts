import { CanvasModule } from '@nymphajs/dom-api';
import { Tetris } from './tetris';

const PLAYER_TEMPLATE_ID = 'player-template';

export class TetrisManager {
  private readonly template = this.getTemplate(PLAYER_TEMPLATE_ID);
  private readonly instances = new Set<Tetris>();

  constructor(private document: Document, private canvasModule: CanvasModule) {}

  createPlayer() {
    const element = this.getContentFromTemplate()! as HTMLDivElement;
    const canvasContainer = element.querySelector('.canvas-container')!;
    const { canvas } = this.canvasModule.init(canvasContainer);

    canvas.width = 240;
    canvas.height = 400;
    canvas.getContext('2d')!.scale(20, 20);

    const tetris = new Tetris(element, canvas);
    this.instances.add(tetris);

    this.document.body.appendChild(element);
    return tetris;
  }

  removePlayer(tetris: Tetris) {
    this.instances.delete(tetris);
    this.document.body.removeChild(tetris.element);
  }

  sortPlayers(sorted: Tetris[]) {
    sorted.forEach((tetris) => {
      this.document.body.appendChild(tetris.element);
    });
  }

  private getTemplate(playerTemplateId: string) {
    const template = this.document.getElementById(playerTemplateId);
    return template as HTMLTemplateElement;
  }

  private getContentFromTemplate() {
    const template = this.document.importNode(this.template.content, true);
    return template.firstElementChild;
  }
}
