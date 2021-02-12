export type Piece = 'T' | 'O' | 'I' | 'S' | 'Z' | 'L' | 'J';

const PIECES: Record<Piece, Array<Array<number>>> = {
  T: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  I: [
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
  ],
  J: [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
  ],
  L: [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  O: [
    [2, 2],
    [2, 2],
  ],
  S: [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
};

export const COLORS = [
  '#000000',
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

export function createPiece(type: Piece) {
  return PIECES[type];
}
