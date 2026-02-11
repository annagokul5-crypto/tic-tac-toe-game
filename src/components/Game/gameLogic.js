/**
 * Rule-based AI for single player. Computer is always O.
 * 1) Prefer winning move, 2) Block opponent win, 3) Random empty cell.
 */
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getEmptyIndices(cells) {
  return cells
    .map((v, i) => (v === null || v === '' ? i : -1))
    .filter((i) => i >= 0);
}

/** Find a line where two cells have `mark` and one is empty; return empty index or -1 */
function findTwoInLine(cells, mark) {
  for (const [a, b, c] of LINES) {
    const vals = [cells[a], cells[b], cells[c]];
    const empty = vals.indexOf(null);
    if (empty === -1) continue;
    const filled = vals.filter((v) => v === mark);
    if (filled.length === 2) {
      const idx = [a, b, c][empty];
      return idx;
    }
  }
  return -1;
}

/** Computer (O) chooses next move: win > block X > random */
export function getComputerMove(cells) {
  const empty = getEmptyIndices(cells);
  if (empty.length === 0) return -1;

  // 1) Win if possible
  const winMove = findTwoInLine(cells, 'O');
  if (winMove >= 0) return winMove;

  // 2) Block X from winning
  const blockMove = findTwoInLine(cells, 'X');
  if (blockMove >= 0) return blockMove;

  // 3) Random
  return empty[Math.floor(Math.random() * empty.length)];
}
