import { useState, useCallback } from 'react';
import Home from './components/Home/Home';
import Game from './components/Game/Game';
import './App.css';

/**
 * App holds main state and simple screen routing (no react-router).
 * Screens: 'home' | 'game'
 */
function App() {
  const [screen, setScreen] = useState('home');
  const [gameMode, setGameMode] = useState(null); // 'single' | 'multi'
  const [playerNames, setPlayerNames] = useState({ p1: '', p2: '' });

  const goHome = useCallback(() => {
    setScreen('home');
    setGameMode(null);
    setPlayerNames({ p1: '', p2: '' });
  }, []);

  const startGame = useCallback((mode, names) => {
    setGameMode(mode);
    setPlayerNames(names);
    setScreen('game');
  }, []);

  return (
    <main className="app">
      {screen === 'home' && (
        <Home onPlayGame={startGame} />
      )}
      {screen === 'game' && (
        <Game
          mode={gameMode}
          playerNames={playerNames}
          onExit={goHome}
        />
      )}
    </main>
  );
}

export default App;
