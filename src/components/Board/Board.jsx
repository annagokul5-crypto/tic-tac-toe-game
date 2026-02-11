import Cell from '../Cell/Cell';
import './Board.css';

const SIZE = 3;
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Returns winning line (array of 3 indices) or null.
 */
export function getWinningLine(cells) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return line;
    }
  }
  return null;
}

/**
 * Returns true if board is full (draw).
 */
export function isDraw(cells) {
  return cells.every((c) => c !== null && c !== '');
}

/**
 * Reusable 3x3 board. Classic grid with continuous lines (no gaps).
 */
function Board({ cells, winningLine, disabled, onCellClick }) {
  return (
    <div
      className="board"
      role="grid"
      aria-label="Tic Tac Toe board"
      style={{ '--size': SIZE }}
    >
      {cells.map((value, index) => (
        <Cell
          key={index}
          value={value}
          isWinCell={winningLine !== null && winningLine.includes(index)}
          disabled={disabled}
          onSelect={() => onCellClick(index)}
        />
      ))}
    </div>
  );
}

export default Board;
