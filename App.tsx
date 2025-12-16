import React, { useState, useEffect } from 'react';
import { GameState, GamePhase } from './types';
import { STORAGE_KEY, MAX_LEVEL, getTaskForLevel, KINGS_PATH_CHALLENGES } from './constants';
import { Button } from './components/Button';
import { GameCard } from './components/GameCard';

const INITIAL_STATE: GameState = {
  level: 1,
  phase: GamePhase.INTRO,
  lastVisit: Date.now(),
  kingsPathUnlocked: false,
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bloom, setBloom] = useState(false);

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState({ ...parsed, phase: GamePhase.INTRO });
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    setLoading(false);
  }, []);

  // Save state on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, loading]);

  const handleBegin = (reset: boolean) => {
    if (reset) {
      setGameState({
        ...INITIAL_STATE,
        phase: GamePhase.PLAYING
      });
      setMessage("Every story deserves another beginning.");
    } else {
      if (gameState.level > MAX_LEVEL) {
         setGameState(prev => ({ ...prev, phase: GamePhase.POST_GAME }));
      } else if (gameState.level === MAX_LEVEL && gameState.kingsPathUnlocked) {
         setGameState(prev => ({ ...prev, phase: GamePhase.COMPLETED }));
      } else {
         setGameState(prev => ({ ...prev, phase: GamePhase.PLAYING }));
      }
      setMessage(null);
    }
  };

  const triggerBloom = () => {
    setBloom(true);
    setTimeout(() => setBloom(false), 1500); // Bloom lasts 1.5s
  };

  const handleTaskComplete = () => {
    triggerBloom();
    
    // Wait for the bloom to fill the screen (approx 0.5s) before swapping data
    setTimeout(() => {
      if (gameState.level >= MAX_LEVEL) {
        setGameState(prev => ({
          ...prev,
          phase: GamePhase.COMPLETED,
          kingsPathUnlocked: true
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
          lastVisit: Date.now()
        }));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleTaskSkip = () => {
    setMessage("Rest is also a form of action. Return when ready.");
    setTimeout(() => setMessage(null), 3000);
  };

  const enterKingsPath = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.POST_GAME }));
  };

  // --- RENDER HELPERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 fade-in text-center p-6 z-10">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif text-stone-800 tracking-wider drop-shadow-sm">
          DO OR DO
        </h1>
        <p className="text-stone-500 italic font-serif text-2xl">
          A Wonderland of Choice
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Button onClick={() => handleBegin(false)}>
          DO
        </Button>
        <Button variant="secondary" onClick={() => handleBegin(true)}>
          BEGIN AGAIN
        </Button>
      </div>

      {message && (
        <p className="text-stone-400 text-sm animate-pulse font-serif">{message}</p>
      )}
    </div>
  );

  const renderGame = () => {
    const task = getTaskForLevel(gameState.level);
    
    return (
      <div className="w-full flex flex-col items-center space-y-8 fade-in p-4 z-10">
        <div className="w-full max-w-md flex justify-between items-center text-xs text-stone-400 uppercase tracking-widest font-semibold">
          <span>Day {gameState.level}</span>
          <span>{MAX_LEVEL} Steps</span>
        </div>
        
        <GameCard 
          task={task} 
          onComplete={handleTaskComplete} 
          onSkip={handleTaskSkip} 
        />
        
        {message && (
          <div className="p-4 bg-white/50 backdrop-blur-sm text-stone-600 rounded-lg text-sm fade-in border border-stone-200 shadow-sm">
            {message}
          </div>
        )}
      </div>
    );
  };

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 fade-in text-center p-8 max-w-2xl mx-auto z-10">
      <h1 className="text-5xl md:text-6xl font-serif text-stone-800 drop-shadow-sm">
        🜁 KING OF THE WORLD 🜁
      </h1>
      <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-serif italic">
        "You didn’t conquer the world. You learned how to live inside it."
      </p>
      <div className="w-16 h-px bg-stone-300"></div>
      <Button onClick={enterKingsPath}>
        Enter Kings' Path
      </Button>
    </div>
  );

  const renderPostGame = () => {
    const challengeIndex = new Date().getDate() % KINGS_PATH_CHALLENGES.length;
    const challenge = KINGS_PATH_CHALLENGES[challengeIndex];

    return (
      <div className="flex flex-col items-center space-y-8 fade-in p-6 text-center max-w-xl mx-auto z-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif text-stone-800">Kings' Path</h2>
          <p className="text-stone-500 text-base font-serif italic">You are now a guide, not a ruler.</p>
        </div>

        <div className="p-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl w-full shadow-xl">
          <h3 className="text-sm uppercase tracking-widest text-stone-400 mb-6">Current Reflection</h3>
          <p className="text-2xl font-serif text-stone-800 leading-relaxed">
            "{challenge}"
          </p>
        </div>

        <Button variant="ghost" onClick={() => handleBegin(true)}>
          Begin the Journey Again
        </Button>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#fdfbf7]" />;

  return (
    <div className="min-h-screen w-full bg-gradient-animate flex flex-col relative overflow-hidden">
      {/* Bloom Overlay */}
      <div className={`bloom-overlay ${bloom ? 'bloom-active' : ''}`}></div>

      {/* Header */}
      <header className="p-8 flex justify-center z-20">
        <div className="w-12 h-1 bg-stone-300/50 rounded-full" />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 w-full max-w-4xl mx-auto">
        {gameState.phase === GamePhase.INTRO && renderIntro()}
        {gameState.phase === GamePhase.PLAYING && renderGame()}
        {gameState.phase === GamePhase.COMPLETED && renderCompleted()}
        {gameState.phase === GamePhase.POST_GAME && renderPostGame()}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="p-8 text-center z-10 pb-12">
        <p className="text-[10px] text-stone-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed opacity-70">
          This is a symbolic self-growth experience. All actions are optional.
          <br />
          Images stay on your device.
        </p>
      </footer>
    </div>
  );
};

export default App;