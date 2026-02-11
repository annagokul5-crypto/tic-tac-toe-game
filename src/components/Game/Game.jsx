import { useState, useEffect, useCallback } from 'react';
import Board, { getWinningLine, isDraw } from '../Board/Board';
import { getComputerMove } from './gameLogic';
import './Game.css';

const INITIAL_CELLS = Array(9).fill(null);

function Game({ mode, playerNames, onExit }) {
  const [cells, setCells] = useState(() => [...INITIAL_CELLS]);
  const [currentTurn, setCurrentTurn] = useState('X'); 
  const [winningLine, setWinningLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0, draw: 0 });

  const p1Name = playerNames.p1 || 'Player 1';
  const p2Name = playerNames.p2 || 'Player 2';
  const isSinglePlayer = mode === 'single';
  const currentPlayerName = currentTurn === 'X' ? p1Name : p2Name;

  const checkEndGame = useCallback((nextCells) => {
    const line = getWinningLine(nextCells);
    if (line) {
      setWinningLine(line);
      setGameOver(true);
      setScores((s) => {
        const winner = nextCells[line[0]];
        if (winner === 'X') return { ...s, p1: s.p1 + 1 };
        return { ...s, p2: s.p2 + 1 };
      });
      return true;
    }
    if (isDraw(nextCells)) {
      setGameOver(true);
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
      return true;
    }
    return false;
  }, []);

  const makeMove = useCallback(
    (index) => {
      if (cells[index] !== null || gameOver || isComputerThinking) return;
      
      // Prevent moves during computer turn in single player
      if (isSinglePlayer && currentTurn === 'O') return;
      
      const nextCells = [...cells];
      nextCells[index] = currentTurn;
      setCells(nextCells);

      if (checkEndGame(nextCells)) return;

      // Single player logic
      const wasHumanTurn = isSinglePlayer && currentTurn === 'X';
      
      // Toggle turn
      const nextTurn = currentTurn === 'X' ? 'O' : 'X';
      setCurrentTurn(nextTurn);

      if (wasHumanTurn) {
        setIsComputerThinking(true);
      }
    },
    [cells, currentTurn, gameOver, isComputerThinking, isSinglePlayer, checkEndGame]
  );

  // Computer AI Effect
  useEffect(() => {
    if (!isSinglePlayer || currentTurn !== 'O' || gameOver) return;

    // Small delay for realism
    const timer = setTimeout(() => {
      // Re-calculate move based on current cells state
      const move = getComputerMove(cells);
      
      if (move === -1) {
         // No moves left (should be caught by draw, but safety check)
         setIsComputerThinking(false);
         return;
      }

      const nextCells = [...cells];
      nextCells[move] = 'O';
      setCells(nextCells);

      if (checkEndGame(nextCells)) {
        setIsComputerThinking(false);
        return;
      }
      
      setCurrentTurn('X');
      setIsComputerThinking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isSinglePlayer, currentTurn, gameOver, cells, checkEndGame]);

  const boardDisabled = gameOver || (isSinglePlayer && currentTurn === 'O') || isComputerThinking;

  const winnerSymbol = winningLine !== null ? cells[winningLine[0]] : null;
  const winnerName = winnerSymbol === 'X' ? p1Name : winnerSymbol === 'O' ? p2Name : null;

  // Reset Game Round
  const handlePlayAgain = () => {
    setCells([...INITIAL_CELLS]);
    setCurrentTurn('X');
    setWinningLine(null);
    setGameOver(false);
    setIsComputerThinking(false);
  };

  return (
    <div className="game">
      {/* EXIT BUTTON (Top Left Corner)
         Positioned absolutely via CSS to sit outside the flow 
      */}
      <button
        type="button"
        className="game__exit-button"
        onClick={onExit}
        aria-label="Exit Game"
      >
        <ExitIcon />
      </button>

      {/* SCORE CARD */}
      <div className="game__scores">
        <div className="game__score game__score--p1">
          <span className="game__score-label">{p1Name}</span>
          <span className="game__score-value">{scores.p1}</span>
        </div>
        <div className="game__score game__score--draw">
          <span className="game__score-label">Draw</span>
          <span className="game__score-value">{scores.draw}</span>
        </div>
        <div className="game__score game__score--p2">
          <span className="game__score-label">{p2Name}</span>
          <span className="game__score-value">{scores.p2}</span>
        </div>
      </div>

      {/* TURN INDICATOR */}
      <p className="game__turn">
        {isComputerThinking ? (
          <>Thinking...</>
        ) : (
          <>Turn: <strong>{currentPlayerName}</strong> ({currentTurn})</>
        )}
      </p>

      {/* GAME BOARD */}
      <div className="game__board-wrap">
        <Board
          cells={cells}
          winningLine={winningLine}
          disabled={boardDisabled}
          onCellClick={makeMove}
        />
      </div>

      {/* GAME OVER MODAL */}
      {gameOver && (
        <div className="game__overlay" role="dialog" aria-modal="true">
          <div className="game__result">
            {winnerName ? (
              <>
                <div className="game__result-emoji">🎉</div>
                <h2 className="game__result-title">{winnerName} wins!</h2>
              </>
            ) : (
              <>
                <h2 className="game__result-title">Match Draw!</h2>
                <p className="game__result-draw-label">Good job guys 🤝</p>
              </>
            )}
            <button
              type="button"
              className="game__play-again"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple "X" Icon for Exit
function ExitIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default Game;