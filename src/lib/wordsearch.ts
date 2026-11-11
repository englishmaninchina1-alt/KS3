export type Cell = { row: number; col: number };

export interface Placement {
  word: string;
  cells: Cell[];
  colour: number;
}

export interface Puzzle {
  size: number;
  grid: string[][];
  placements: Placement[];
  skipped: string[];
}

const ALL_DIRECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
];

const EASY_DIRECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 0],
];

/** Letters weighted roughly like natural English, so the filler looks friendly. */
const FILLER = 'eeeeeeeeaaaaaiiiooouunnssrrtllcdmpphgbkwyfvjxzq'.split('');

function fits(grid: (string | null)[][], word: string, row: number, col: number, dr: number, dc: number, size: number): boolean {
  for (let i = 0; i < word.length; i += 1) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    const cell = grid[r][c];
    if (cell !== null && cell !== word[i]) return false;
  }
  return true;
}

/**
 * Builds a word-search puzzle. Words that are too long or cannot be placed
 * (very rare) are returned in `skipped` so the UI can be honest about them.
 */
export function buildPuzzle(
  rawWords: string[],
  size: number,
  options: { diagonals: boolean; backwards: boolean },
): Puzzle {
  const words = Array.from(
    new Set(
      rawWords
        .map((word) => word.toUpperCase().replace(/[^A-Z]/g, ''))
        .filter((word) => word.length >= 3 && word.length <= size),
    ),
  ).sort((a, b) => b.length - a.length);

  const directions = options.diagonals ? ALL_DIRECTIONS : EASY_DIRECTIONS;
  const dirs = options.backwards
    ? directions
    : directions.filter(([dr, dc]) => dr >= 0 && dc >= 0);

  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const placements: Placement[] = [];
  const skipped: string[] = [];

  words.forEach((word, index) => {
    for (let attempt = 0; attempt < 350; attempt += 1) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)] ?? dirs[0];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (!fits(grid, word, row, col, dr, dc, size)) continue;

      const cells: Cell[] = [];
      for (let i = 0; i < word.length; i += 1) {
        const r = row + dr * i;
        const c = col + dc * i;
        grid[r][c] = word[i];
        cells.push({ row: r, col: c });
      }
      placements.push({ word, cells, colour: index % 8 });
      return;
    }
    skipped.push(word);
  });

  const placed = new Set(placements.flatMap((placement) => placement.cells.map((cell) => grid[cell.row][cell.col])));
  const pool = [...Array.from(placed).filter(Boolean) as string[], ...FILLER, ...FILLER];

  const filled = grid.map((row) =>
    row.map((letter) => letter ?? pool[Math.floor(Math.random() * pool.length)]),
  );

  return { size, grid: filled, placements, skipped };
}

export function cellsBetween(start: Cell, end: Cell): Cell[] | null {
  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;
  const straight = rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);
  if (!straight) return null;

  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
  const dr = Math.sign(rowDiff);
  const dc = Math.sign(colDiff);
  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i += 1) {
    cells.push({ row: start.row + dr * i, col: start.col + dc * i });
  }
  return cells;
}

export function wordsMatch(a: string, b: string): boolean {
  return a.toUpperCase() === b.toUpperCase();
}

export const FOUND_COLOURS = [
  '#fef08a',
  '#bbf7d0',
  '#bfdbfe',
  '#fbcfe8',
  '#fed7aa',
  '#ddd6fe',
  '#a5f3fc',
  '#fecaca',
];
