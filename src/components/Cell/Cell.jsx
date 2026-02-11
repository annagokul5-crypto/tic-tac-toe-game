import './Cell.css';

/**
 * Single cell in the Tic Tac Toe board.
 * Renders nothing, X, or O with theme colors; supports win highlight.
 */
function Cell({ value, isWinCell, disabled, onSelect }) {
  const isEmpty = value === null || value === '';
  const canClick = isEmpty && !disabled;

  return (
    <button
      type="button"
      className={`cell ${isWinCell ? 'cell--win' : ''} ${value === 'X' ? 'cell--x' : ''} ${value === 'O' ? 'cell--o' : ''}`}
      onClick={() => canClick && onSelect()}
      disabled={!canClick}
      aria-label={isEmpty ? 'Empty cell' : `Cell contains ${value}`}
    >
      {value && <span className="cell__symbol">{value}</span>}
    </button>
  );
}

export default Cell;
