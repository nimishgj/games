'use client';

import { useState, useEffect, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Position {
  x: number;
  y: number;
}

export function Snake() {
  // Game settings
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const GAME_SPEED = 150; // milliseconds per move (higher value = slower speed)
  
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random position for food
  const generateFood = (): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Make sure food doesn't appear on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    
    return newFood;
  };

  // Start a new game
  const startGame = () => {
    // Reset game state
    setSnake([{ x: 5, y: 5 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    setIsPaused(false);
    
    // Clear any existing game loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    // Start game loop
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
  };

  // Toggle pause state
  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    
    setIsPaused(prev => {
      const newPaused = !prev;
      
      if (newPaused) {
        // Pause the game
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      } else {
        // Resume the game
        gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
      }
      
      return newPaused;
    });
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't allow direction changes if game is over or paused
      if (gameOver || isPaused) return;

      // Only change direction if game has started
      if (!gameStarted && e.key !== ' ') return;

      // Start game if not started
      if (!gameStarted && e.key === ' ') {
        startGame();
        return;
      }

      // Toggle pause
      if (e.key === ' ') {
        togglePause();
        return;
      }

      // Prevent pressing opposite direction (can't go backwards)
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted, isPaused]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Move the snake
  const moveSnake = () => {
    setSnake(prevSnake => {
      // Create a copy of the snake
      const newSnake = [...prevSnake];
      
      // Get current head position
      const head = { ...newSnake[0] };
      
      // Calculate new head position based on direction
      switch (directionRef.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }
      
      // Check for collision with walls
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }
      
      // Check for collision with self (except tail which will move)
      if (newSnake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }
      
      // Add new head to beginning of snake
      newSnake.unshift(head);
      
      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        // Increase score
        setScore(prevScore => prevScore + 1);
        
        // Generate new food
        setFood(generateFood());
      } else {
        // Remove tail if food wasn't eaten
        newSnake.pop();
      }
      
      return newSnake;
    });
  };

  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    setHighScore(prev => Math.max(prev, score));
    
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  // Functions for touch controls (for mobile devices)
  const handleSwipe = (direction: Direction) => {
    if (gameOver || isPaused) return;
    
    // Start game if not started
    if (!gameStarted) {
      startGame();
      return;
    }
    
    // Prevent pressing opposite direction
    switch (direction) {
      case 'UP':
        if (directionRef.current !== 'DOWN') {
          setDirection('UP');
          directionRef.current = 'UP';
        }
        break;
      case 'DOWN':
        if (directionRef.current !== 'UP') {
          setDirection('DOWN');
          directionRef.current = 'DOWN';
        }
        break;
      case 'LEFT':
        if (directionRef.current !== 'RIGHT') {
          setDirection('LEFT');
          directionRef.current = 'LEFT';
        }
        break;
      case 'RIGHT':
        if (directionRef.current !== 'LEFT') {
          setDirection('RIGHT');
          directionRef.current = 'RIGHT';
        }
        break;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-md">
        <div className="text-xl font-semibold">Score: {score}</div>
        <div className="text-xl">High Score: {highScore}</div>
      </div>
      
      <div 
        className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 mb-4"
        style={{ 
          width: `${GRID_SIZE * CELL_SIZE}px`, 
          height: `${GRID_SIZE * CELL_SIZE}px`,
          position: 'relative' 
        }}
      >
        {/* Food */}
        <div
          className="bg-red-500 absolute rounded-full"
          style={{
            width: `${CELL_SIZE - 2}px`,
            height: `${CELL_SIZE - 2}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-700' : 'bg-green-500'}`}
            style={{
              width: `${CELL_SIZE - 2}px`,
              height: `${CELL_SIZE - 2}px`,
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              borderRadius: index === 0 ? '4px' : '0',
            }}
          />
        ))}
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
            <div className="text-2xl mb-2">Game Over!</div>
            <div className="mb-4">Final Score: {score}</div>
            <button
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors"
              onClick={startGame}
            >
              Play Again
            </button>
          </div>
        )}
        
        {/* Start game overlay */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
            <div className="text-2xl mb-4">Snake Game</div>
            <button
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        )}
        
        {/* Pause overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
            <div className="text-2xl mb-4">Game Paused</div>
            <button
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              onClick={togglePause}
            >
              Resume
            </button>
          </div>
        )}
      </div>
      
      {/* Touch controls for mobile */}
      <div className="md:hidden grid grid-cols-3 gap-2 w-48 mb-4">
        <div className="col-span-1"></div>
        <button
          className="col-span-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"
          onClick={() => handleSwipe('UP')}
        >
          ↑
        </button>
        <div className="col-span-1"></div>
        
        <button
          className="col-span-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"
          onClick={() => handleSwipe('LEFT')}
        >
          ←
        </button>
        <button
          className="col-span-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"
          onClick={togglePause}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          className="col-span-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"
          onClick={() => handleSwipe('RIGHT')}
        >
          →
        </button>
        
        <div className="col-span-1"></div>
        <button
          className="col-span-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"
          onClick={() => handleSwipe('DOWN')}
        >
          ↓
        </button>
        <div className="col-span-1"></div>
      </div>
      
      <div className="text-gray-600 dark:text-gray-300 text-sm">
        Use arrow keys to control the snake. Press Space to pause/resume.
      </div>
    </div>
  );
}
