import { useState } from 'react';
import './Home.css';

const MODES = [
  { id: 'single', label: 'Single Player' },
  { id: 'multi', label: 'Multiplayer' },
];

const DEFAULT_NAMES = {
  single: { p1: 'Player 1', p2: 'Master XO' },
  multi: { p1: 'Player 1', p2: 'Player 2' },
};

/**
 * Home screen: title, Play Game button, mode selection.
 * On "Play Game" click shows mode options; selecting a mode opens player setup then starts game.
 */
function Home({ onPlayGame }) {
  const [showModes, setShowModes] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showSingleSetup, setShowSingleSetup] = useState(false);
  const [showMultiSetup, setShowMultiSetup] = useState(false);
  const [singleName, setSingleName] = useState('');
  const [multiP1, setMultiP1] = useState('');
  const [multiP2, setMultiP2] = useState('');

  const handlePlayClick = () => {
    setShowModes(true);
  };

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
    if (modeId === 'single') {
      setShowSingleSetup(true);
      setShowModes(false);
    } else {
      setShowMultiSetup(true);
      setShowModes(false);
    }
  };

  const handleSingleStart = () => {
    const p1 = singleName.trim() || DEFAULT_NAMES.single.p1;
    onPlayGame('single', { p1, p2: DEFAULT_NAMES.single.p2 });
  };

  const handleMultiStart = () => {
    const p1 = multiP1.trim() || DEFAULT_NAMES.multi.p1;
    const p2 = multiP2.trim() || DEFAULT_NAMES.multi.p2;
    onPlayGame('multi', { p1, p2 });
  };

  const closeSingleSetup = () => {
    setShowSingleSetup(false);
    setSingleName('');
    setSelectedMode(null);
  };

  const closeMultiSetup = () => {
    setShowMultiSetup(false);
    setMultiP1('');
    setMultiP2('');
    setSelectedMode(null);
  };

  return (
    <div className="home">
      <h1 className="home__title">Tic Tac Toe</h1>
      <p className="home__subtitle">Choose your mode and play</p>

      {!showModes && !showSingleSetup && !showMultiSetup && (
        <button
          type="button"
          className="home__play-btn"
          onClick={handlePlayClick}
          aria-label="Play game"
        >
          Play Game
        </button>
      )}

      {showModes && (
        <div className="home__modes">
          <p className="home__modes-label">Player mode</p>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="home__mode-btn"
              onClick={() => handleModeSelect(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Single Player setup dialog */}
      {showSingleSetup && (
        <div className="home__overlay" role="dialog" aria-label="Single player setup">
          <div className="home__card">
            <h2 className="home__card-title">Single Player</h2>
            <p className="home__card-hint">Your opponent is Master XO (Computer)</p>
            <label className="home__label">
              Your name
              <input
                type="text"
                className="home__input"
                placeholder="Player 1"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                maxLength={20}
              />
            </label>
            <div className="home__card-actions">
              <button type="button" className="home__btn home__btn--secondary" onClick={closeSingleSetup}>
                Cancel
              </button>
              <button type="button" className="home__btn home__btn--primary" onClick={handleSingleStart}>
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multiplayer setup dialog */}
      {showMultiSetup && (
        <div className="home__overlay" role="dialog" aria-label="Multiplayer setup">
          <div className="home__card">
            <h2 className="home__card-title">Multiplayer</h2>
            <p className="home__card-hint">Same device — enter both names</p>
            <label className="home__label">
              Player 1 (X)
              <input
                type="text"
                className="home__input"
                placeholder="Player 1"
                value={multiP1}
                onChange={(e) => setMultiP1(e.target.value)}
                maxLength={20}
              />
            </label>
            <label className="home__label">
              Player 2 (O)
              <input
                type="text"
                className="home__input"
                placeholder="Player 2"
                value={multiP2}
                onChange={(e) => setMultiP2(e.target.value)}
                maxLength={20}
              />
            </label>
            <div className="home__card-actions">
              <button type="button" className="home__btn home__btn--secondary" onClick={closeMultiSetup}>
                Cancel
              </button>
              <button type="button" className="home__btn home__btn--primary" onClick={handleMultiStart}>
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
