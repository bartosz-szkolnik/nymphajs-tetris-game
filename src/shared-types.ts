export const STATE_UPDATE = 'state-update';

export type SharedEvents = typeof STATE_UPDATE;

export type SerializedArena = {
  matrix: Array<Array<number>>;
};

export type SerializedPlayer = {
  score: number;
  matrix: Array<Array<number>>;
  pos: { x: number; y: number };
};

export type SerializedTetris = {
  player: SerializedPlayer;
  arena: SerializedArena;
};

export type SerializedFragment = {
  fragment: 'arena' | 'player';
  data: [keyof SerializedPlayer | keyof SerializedArena, unknown];
};
