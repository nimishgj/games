'use client';

import { useState, useEffect, useRef } from 'react';

type Board = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';

export function Game2048() {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [hasWonBefore, setHasWonBefore] = useState(false);

  // Initialize the game
  const initGame = () => {
    // Create a new empty board
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    
    // Add two initial tiles
    const boardWithFirstTile = addRandomTile(newBoard);
    const boardWithTwoTiles = addRandomTile(boardWithFirstTile);
    
    // Update state
    setBoard(boardWithTwoTiles);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    // Try to load best score from localStorage first
    const savedBestScore = localStorage.getItem('2048-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
    
    // Initialize game with a slight delay to ensure rendering is complete
    setTimeout(() => {
      initGame();
    }, 100);
  }, []);

  // Save best score to localStorage when it changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = (currentBoard: Board): Board => {
    const emptyCells: [number, number][] = [];
    
    // Find all empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    // If no empty cells, return the board as is
    if (emptyCells.length === 0) return currentBoard;

    // Pick a random empty cell
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Place either 2 (90%) or 4 (10%)
    const newValue = Math.random() < 0.9 ? 2 : 4;
    
    // Create a deep copy and update it
    const newBoard: Board = JSON.parse(JSON.stringify(currentBoard));
    newBoard[row][col] = newValue;
    
    return newBoard;
  };

  // Check if the game is over (no valid moves)
  const isGameOver = (currentBoard: Board): boolean => {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) return false;
      }
    }

    // Check for possible merges in rows
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentBoard[row][col] === currentBoard[row][col + 1]) {
          return false;
        }
      }
    }

    // Check for possible merges in columns
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (currentBoard[row][col] === currentBoard[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  };

  // Move tiles and merge them
  const move = (direction: Direction): void => {
    if (gameOver) return;

    // Make a deep copy of the board
    let hasChanged = false;
    const newBoard: Board = JSON.parse(JSON.stringify(board));
    let newScore = score;

    // Define the order of traversal based on direction
    const traverse = (callback: (row: number, col: number) => void) => {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          // For up and left, we start from top-left
          // For down and right, we start from bottom-right
          const r = direction === 'down' ? 3 - row : row;
          const c = direction === 'right' ? 3 - col : col;
          callback(r, c);
        }
      }
    };

    // Move one tile as far as possible in the given direction
    const moveTile = (row: number, col: number): void => {
      // Skip empty cells
      if (newBoard[row][col] === 0) return;

      let r = row;
      let c = col;
      const originalValue = newBoard[row][col];
      
      // Calculate the next position
      const getNext = (): [number, number] => {
        switch (direction) {
          case 'up': return [r - 1, c];
          case 'down': return [r + 1, c];
          case 'left': return [r, c - 1];
          case 'right': return [r, c + 1];
        }
      };

      // Check if the next position is valid
      const isValidNext = (row: number, col: number): boolean => {
        return row >= 0 && row < 4 && col >= 0 && col < 4;
      };

      // Move as far as possible
      let [nextRow, nextCol] = getNext();
      while (isValidNext(nextRow, nextCol) && newBoard[nextRow][nextCol] === 0) {
        r = nextRow;
        c = nextCol;
        [nextRow, nextCol] = getNext();
      }

      // Check if we can merge with the next tile
      if (isValidNext(nextRow, nextCol) && newBoard[nextRow][nextCol] === originalValue) {
        r = nextRow;
        c = nextCol;
        // Double the value and add to score
        newBoard[r][c] *= 2;
        newScore += newBoard[r][c];
        
        // Check for win condition (reaching 2048)
        if (newBoard[r][c] === 2048 && !hasWonBefore) {
          setGameWon(true);
          setHasWonBefore(true);
        }
      } else {
        // Just move to the farthest empty cell
        newBoard[r][c] = originalValue;
      }

      // Clear the original cell if it moved
      if (r !== row || c !== col) {
        newBoard[row][col] = 0;
        hasChanged = true;
      }
    };

    // Process the move
    if (direction === 'up' || direction === 'down') {
      // Process column by column
      for (let col = 0; col < 4; col++) {
        // First pass: move all tiles as far as they can go
        traverse((row, c) => {
          if (c === col) moveTile(row, c);
        });

        // Second pass: merge adjacent tiles with same value
        traverse((row, c) => {
          if (c === col && newBoard[row][c] !== 0) {
            let [nextRow, nextCol] = direction === 'up' ? [row - 1, c] : [row + 1, c];
            if (nextRow >= 0 && nextRow < 4 && newBoard[nextRow][nextCol] === newBoard[row][c]) {
              newBoard[nextRow][nextCol] *= 2;
              newScore += newBoard[nextRow][nextCol];
              newBoard[row][c] = 0;
              hasChanged = true;
              
              if (newBoard[nextRow][nextCol] === 2048 && !hasWonBefore) {
                setGameWon(true);
                setHasWonBefore(true);
              }
            }
          }
        });
      }
    } else {
      // Process row by row for left and right
      for (let row = 0; row < 4; row++) {
        // First pass: move all tiles as far as they can go
        traverse((r, col) => {
          if (r === row) moveTile(r, col);
        });

        // Second pass: merge adjacent tiles with same value
        traverse((r, col) => {
          if (r === row && newBoard[r][col] !== 0) {
            let [nextRow, nextCol] = direction === 'left' ? [r, col - 1] : [r, col + 1];
            if (nextCol >= 0 && nextCol < 4 && newBoard[nextRow][nextCol] === newBoard[r][col]) {
              newBoard[nextRow][nextCol] *= 2;
              newScore += newBoard[nextRow][nextCol];
              newBoard[r][col] = 0;
              hasChanged = true;
              
              if (newBoard[nextRow][nextCol] === 2048 && !hasWonBefore) {
                setGameWon(true);
                setHasWonBefore(true);
              }
            }
          }
        });
      }
    }

    // Only add a new tile if something changed
    if (hasChanged) {
      const boardWithNewTile = addRandomTile(newBoard);
      setBoard(boardWithNewTile);
      setScore(newScore);
      
      // Check if game is over after adding the new tile
      if (isGameOver(boardWithNewTile)) {
        setGameOver(true);
      }
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  // Handle touch gestures
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    touchStartRef.current = { x: clientX, y: clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const { clientX, clientY } = e.changedTouches[0];
    const { x: startX, y: startY } = touchStartRef.current;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Determine which gesture has larger magnitude
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 30) {
        move('right');
      } else if (deltaX < -30) {
        move('left');
      }
    } else {
      // Vertical swipe
      if (deltaY > 30) {
        move('down');
      } else if (deltaY < -30) {
        move('up');
      }
    }

    touchStartRef.current = null;
  };

  // Get tile background color based on the value
  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      0: 'bg-gray-200',
      2: 'bg-amber-100 text-gray-800',
      4: 'bg-amber-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-orange-600 text-white',
      128: 'bg-yellow-300 text-white',
      256: 'bg-yellow-400 text-white',
      512: 'bg-yellow-500 text-white',
      1024: 'bg-yellow-600 text-white',
      2048: 'bg-yellow-700 text-white',
    };
    
    return colors[value] || 'bg-red-600 text-white';
  };

  // Get font size based on the number of digits
  const getFontSize = (value: number): string => {
    if (value < 100) return 'text-3xl';
    if (value < 1000) return 'text-2xl';
    return 'text-xl';
  };

  return (
    <div 
      className="flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-md mb-4 flex justify-between">
        <div className="flex flex-col bg-gray-200 dark:bg-gray-700 rounded p-2 w-24 text-center">
          <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-300">Score</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
        <div className="flex flex-col bg-gray-200 dark:bg-gray-700 rounded p-2 w-24 text-center">
          <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-300">Best</span>
          <span className="text-xl font-bold">{bestScore}</span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={initGame}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          New Game
        </button>
      </div>

      <div className="relative bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${getTileColor(cell)} w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-md shadow-md transition-all duration-100 ${cell ? 'animate-pop' : ''}`}
              >
                <span className={`font-bold ${getFontSize(cell)}`}>
                  {cell !== 0 ? cell : ''}
                </span>
              </div>
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md text-center">
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="mb-4">Your score: {score}</p>
              <button
                onClick={initGame}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {gameWon && !gameOver && (
          <div className="absolute inset-0 bg-yellow-400 bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md text-center">
              <h2 className="text-2xl font-bold mb-2">You Win!</h2>
              <p className="mb-4">You reached 2048! Continue playing?</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => setGameWon(false)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Keep Playing
                </button>
                <button
                  onClick={initGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
        <p className="mb-2">Use arrow keys to move the tiles.</p>
        <p>On mobile, you can swipe to move.</p>
      </div>
      
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 200ms ease-in-out;
        }
      `}</style>
    </div>
  );
}
