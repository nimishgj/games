'use client';

import { useState, useEffect, useCallback } from 'react';

// Define colors for the Simon Says game
const colors = ['green', 'red', 'yellow', 'blue'];
type ColorType = typeof colors[number];

export function SimonSays() {
  const [sequence, setSequence] = useState<ColorType[]>([]);
  const [playerSequence, setPlayerSequence] = useState<ColorType[]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'showingPattern' | 'playerTurn' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeColor, setActiveColor] = useState<ColorType | null>(null);
  const [speed, setSpeed] = useState(1000); // Base speed in ms
  
  // Initialize game
  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setGameStatus('idle');
    setScore(0);
    setLevel(1);
    // Reset speed based on difficulty
    setSpeed(1000);
    setTimeout(() => {
      addToSequence();
    }, 500);
  }, []);
  
  // Add a random color to the sequence
  const addToSequence = useCallback(() => {
    setGameStatus('showingPattern');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence(prevSequence => [...prevSequence, randomColor]);
  }, []);

  // Show the pattern to the player
  useEffect(() => {
    if (gameStatus === 'showingPattern' && sequence.length > 0) {
      let step = 0;
      
      const showStep = () => {
        // Highlight the current color
        setActiveColor(sequence[step]);
        
        // After a delay, turn off the color
        setTimeout(() => {
          setActiveColor(null);
          
          // Move to the next step or finish showing pattern
          step++;
          if (step < sequence.length) {
            // Wait before showing the next color
            setTimeout(showStep, speed / 2);
          } else {
            // Pattern finished, player's turn
            setGameStatus('playerTurn');
            setPlayerSequence([]);
          }
        }, speed / 2);
      };
      
      // Start showing the pattern after a short delay
      const patternDelay = setTimeout(showStep, 1000);
      
      return () => {
        clearTimeout(patternDelay);
      };
    }
  }, [gameStatus, sequence, speed]);

  // Handle player color clicks
  const handleColorClick = useCallback((color: ColorType) => {
    // Only accept input during player's turn
    if (gameStatus !== 'playerTurn') return;
    
    // Highlight the clicked color briefly
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);
    
    // Add color to player sequence
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    
    // Check if the player's move is correct
    const currentStep = playerSequence.length;
    if (color !== sequence[currentStep]) {
      // Wrong move
      setGameStatus('gameOver');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simon-says-high-score', score.toString());
      }
      return;
    }
    
    // Check if the player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      // Update score
      setScore(prevScore => prevScore + sequence.length);
      
      // Increase level
      setLevel(prevLevel => prevLevel + 1);
      
      // Speed up slightly as levels increase (but not too much)
      const newSpeed = Math.max(300, 1000 - (level * 50));
      setSpeed(newSpeed);
      
      // Add new step to the sequence after a delay
      setTimeout(() => {
        addToSequence();
      }, 1500);
    }
  }, [gameStatus, playerSequence, sequence, addToSequence, score, highScore, level]);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('simon-says-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Helper to get button styles based on color and state
  const getButtonStyles = (color: ColorType) => {
    const baseStyles = "w-36 h-36 sm:w-40 sm:h-40 m-1 rounded-lg transition-all duration-200";
    
    const colorStyles: Record<ColorType, string> = {
      green: activeColor === 'green' ? "bg-green-400 scale-105" : "bg-green-600 hover:bg-green-500",
      red: activeColor === 'red' ? "bg-red-400 scale-105" : "bg-red-600 hover:bg-red-500",
      yellow: activeColor === 'yellow' ? "bg-yellow-300 scale-105" : "bg-yellow-500 hover:bg-yellow-400",
      blue: activeColor === 'blue' ? "bg-blue-400 scale-105" : "bg-blue-600 hover:bg-blue-500"
    };
    
    return `${baseStyles} ${colorStyles[color]}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex mb-4">
          <div className="text-center mx-4">
            <div className="text-xl font-semibold">Score</div>
            <div className="text-3xl">{score}</div>
          </div>
          <div className="text-center mx-4">
            <div className="text-xl font-semibold">High Score</div>
            <div className="text-3xl">{highScore}</div>
          </div>
          <div className="text-center mx-4">
            <div className="text-xl font-semibold">Level</div>
            <div className="text-3xl">{level}</div>
          </div>
        </div>
        
        <div className="mb-4">
          {gameStatus === 'idle' && (
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-lg font-semibold"
              onClick={startGame}
            >
              Start Game
            </button>
          )}
          
          {gameStatus === 'showingPattern' && (
            <div className="text-xl">Watch the pattern...</div>
          )}
          
          {gameStatus === 'playerTurn' && (
            <div className="text-xl">Your turn! Repeat the pattern.</div>
          )}
          
          {gameStatus === 'gameOver' && (
            <div className="flex flex-col items-center">
              <div className="text-xl text-red-500 mb-2">Game Over!</div>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-lg font-semibold"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {colors.map(color => (
          <button
            key={color}
            className={getButtonStyles(color as ColorType)}
            onClick={() => handleColorClick(color as ColorType)}
            disabled={gameStatus !== 'playerTurn'}
          />
        ))}
      </div>
      
      <div className="mt-8 text-gray-600 dark:text-gray-300 text-center">
        <p>Watch the pattern, then repeat it by clicking the colored buttons in the same order.</p>
        <p>Each successful round adds a new step to the pattern.</p>
      </div>
    </div>
  );
}
