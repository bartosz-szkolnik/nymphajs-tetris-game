import { setupKeyboardFor } from './input';
import { CanvasModule } from '@nymphajs/dom-api';
import { Matrix, Vec2 } from '@nymphajs/core';
import { TetrisManager } from './tetris-manager';
import {
  ConnectionManager,
  Message,
  BROADCAST_SESSION,
  BroadcastMessage,
} from '@nymphajs/network';
import { Tetris } from './tetris';
import {
  SerializedFragment,
  SerializedTetris,
  SharedEvents,
  STATE_UPDATE,
} from '../shared-types';
import {
  ArenaEvent,
  CHANGE_POSITION,
  MATRIX_CHANGED,
  MATRIX_ROTATED,
  PlayerEvent,
  UPDATE_SCORE,
} from './events';

// needs refactor

const canvasModule = new CanvasModule();
const tetrisManager = new TetrisManager(document, canvasModule);

const tetrisGames = new Map<string, Tetris>();

const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.start();

const input = setupKeyboardFor(localTetris.player, false);
input.listenTo(window);

const connectionManager = new ConnectionManager(true);
connectionManager.connect('ws://localhost:9000', localTetris.serialize());

function updateManager(peers: Message['peers']) {
  if (!peers) {
    return;
  }

  const me = peers.you;
  const clients = peers.clients.filter((client) => client.id !== me);
  clients.forEach((peer) => {
    if (!tetrisGames.has(peer.id)) {
      const tetris = tetrisManager.createPlayer();
      tetrisGames.set(peer.id, tetris);

      tetris.deserialize(peer.state as SerializedTetris);
    }
  });

  [...tetrisGames.entries()].forEach(([id, tetris]) => {
    if (!clients.some((client) => client.id === id)) {
      tetrisManager.removePlayer(tetris);
      tetrisGames.delete(id);
    }
  });

  const sorted = peers.clients.map((peer) => {
    return tetrisGames.get(peer.id) || localTetris;
  });
  tetrisManager.sortPlayers(sorted);
}

function updatePeer(
  broadcasterId: string,
  fragment: 'player' | 'arena',
  [prop, value]: [PlayerEvent | ArenaEvent, unknown]
) {
  if (!connectionManager.peers.has(broadcasterId)) {
    return console.error('Player does not exist.');
  }

  const tetris = tetrisGames.get(broadcasterId)!;
  if (fragment === 'player') {
    const player = tetris[fragment];
    if (prop === CHANGE_POSITION) {
      player.pos = value as Vec2;
    } else if (prop === MATRIX_ROTATED) {
      player.matrix.grid = value as Matrix<number>['grid'];
    } else if (prop === UPDATE_SCORE) {
      player.score = value as number;
    }
  } else if (fragment === 'arena' && prop === MATRIX_CHANGED) {
    tetris.arena.matrix.grid = value as Matrix<number>['grid'];
  }

  if (prop === UPDATE_SCORE) {
    tetris.updateScore(value as number);
  } else {
    tetris.draw();
  }
}

connectionManager.on<Message>(BROADCAST_SESSION, (data) => {
  updateManager(data.peers);
});

connectionManager.on<BroadcastMessage>(STATE_UPDATE, (data) => {
  const stateData = data.data as SerializedFragment;
  updatePeer(data.broadcasterId, stateData.fragment, stateData.data);
});

const playerEvents: PlayerEvent[] = [
  CHANGE_POSITION,
  MATRIX_ROTATED,
  UPDATE_SCORE,
];
playerEvents.forEach((event) => {
  localTetris.player.events.listen(event, (value) => {
    const data: SerializedFragment = {
      fragment: 'player',
      data: [event, value],
    };

    connectionManager.sendData<SharedEvents>({
      type: STATE_UPDATE,
      data,
    });
  });
});

localTetris.arena.events.listen(MATRIX_CHANGED, (matrix: number[][]) => {
  const data: SerializedFragment = {
    fragment: 'arena',
    data: ['matrix', matrix],
  };

  connectionManager.sendData<SharedEvents>({
    type: STATE_UPDATE,
    data,
  });
});
