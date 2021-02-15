// Player events
export const UPDATE_SCORE = 'score';
export const CHANGE_POSITION = 'pos';
export const MATRIX_ROTATED = 'matrix';

// Arena events
export const MATRIX_CHANGED = 'matrix';

export type PlayerEvent =
  | typeof UPDATE_SCORE
  | typeof CHANGE_POSITION
  | typeof MATRIX_ROTATED;

export type ArenaEvent = typeof MATRIX_CHANGED;
