'use client';

import { useState, useEffect } from 'react';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type GameStatus = 'waiting' | 'playing' | 'won' | 'lost';

interface MinesweeperSettings {
  rows: number;
  cols: number;
  mines: number;
}

const difficultySettings: Record<string, MinesweeperSettings> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

export function Minesweeper() {
  const [difficulty, setDifficulty] = useState<keyof typeof difficultySettings>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [minesLeft, setMinesLeft] = useState(0);
  const [timer, setTimer] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  
  // Initialize the game board
  const initializeGame = (settings: MinesweeperSettings) => {
    const { rows, cols, mines } = settings;
    
    // Create empty grid
    const newGrid: Cell[][] = Array(rows).fill(null).map((_, rowIndex) => 
      Array(cols).fill(null).map((_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    
    setGrid(newGrid);
    setMinesLeft(mines);
    setTimer(0);
    setGameStatus('playing');
    setFirstClick(true);
  };
  
  // Plant mines on the grid, avoiding the first clicked cell
  const plantMines = (firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = difficultySettings[difficulty];
    const newGrid = [...grid];
    let minesPlanted = 0;
    
    // Create a safety zone around the first click
    const safeZone = [];
    for (let r = Math.max(0, firstRow - 1); r <= Math.min(rows - 1, firstRow + 1); r++) {
      for (let c = Math.max(0, firstCol - 1); c <= Math.min(cols - 1, firstCol + 1); c++) {
        safeZone.push(`${r}-${c}`);
      }
    }
    
    // Plant mines randomly
    while (minesPlanted < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      const cellKey = `${randomRow}-${randomCol}`;
      
      if (!newGrid[randomRow][randomCol].isMine && !safeZone.includes(cellKey)) {
        newGrid[randomRow][randomCol].isMine = true;
        minesPlanted++;
      }
    }
    
    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          // Check all 8 neighbors
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              
              const newR = r + i;
              const newC = c + j;
              
              if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && newGrid[newR][newC].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    
    setGrid(newGrid);
    setFirstClick(false);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    // Cannot click on flagged cells
    if (grid[row][col].isFlagged) return;
    
    // First click should never be a mine
    if (firstClick) {
      plantMines(row, col);
    }
    
    const newGrid = [...grid];
    
    // If it's a mine, game over
    if (newGrid[row][col].isMine) {
      revealAllMines(newGrid);
      setGameStatus('lost');
      return;
    }
    
    // Reveal the clicked cell
    revealCell(newGrid, row, col);
    
    // Check if the game is won
    checkWinCondition(newGrid);
    
    setGrid(newGrid);
  };
  
  // Handle right click (flag)
  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || grid[row][col].isRevealed) return;
    
    const newGrid = [...grid];
    const cell = newGrid[row][col];
    
    // Toggle flag
    cell.isFlagged = !cell.isFlagged;
    
    // Update mines left count
    setMinesLeft(prev => cell.isFlagged ? prev - 1 : prev + 1);
    
    setGrid(newGrid);
  };
  
  // Recursive function to reveal cells
  const revealCell = (grid: Cell[][], row: number, col: number) => {
    const { rows, cols } = difficultySettings[difficulty];
    const cell = grid[row][col];
    
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    
    // If cell has no adjacent mines, reveal all neighbors
    if (cell.neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          
          const newR = row + i;
          const newC = col + j;
          
          if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
            revealCell(grid, newR, newC);
          }
        }
      }
    }
  };
  
  // Reveal all mines when the game is lost
  const revealAllMines = (grid: Cell[][]) => {
    const { rows, cols } = difficultySettings[difficulty];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isMine) {
          grid[r][c].isRevealed = true;
        }
      }
    }
  };
  
  // Check if the game is won
  const checkWinCondition = (grid: Cell[][]) => {
    const { rows, cols, mines } = difficultySettings[difficulty];
    let revealedCount = 0;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isRevealed) {
          revealedCount++;
        }
      }
    }
    
    // Game is won if all non-mine cells are revealed
    if (revealedCount === rows * cols - mines) {
      setGameStatus('won');
      
      // Flag all remaining mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].isMine && !grid[r][c].isFlagged) {
            grid[r][c].isFlagged = true;
          }
        }
      }
      
      setMinesLeft(0);
    }
  };
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStatus === 'playing' && !firstClick) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameStatus, firstClick]);
  
  // Start new game when difficulty changes
  useEffect(() => {
    initializeGame(difficultySettings[difficulty]);
  }, [difficulty]);
  
  // Get the color for a cell based on its neighbor mines count
  const getNumberColor = (count: number): string => {
    const colors = [
      '', // 0 has no number
      'text-blue-600', // 1
      'text-green-600', // 2
      'text-red-600', // 3
      'text-purple-600', // 4
      'text-yellow-700', // 5
      'text-cyan-600', // 6
      'text-black', // 7
      'text-gray-600', // 8
    ];
    return colors[count] || '';
  };
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setDifficulty('beginner')}
              className={`px-3 py-1 rounded ${difficulty === 'beginner' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Beginner
            </button>
            <button
              onClick={() => setDifficulty('intermediate')}
              className={`px-3 py-1 rounded ${difficulty === 'intermediate' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setDifficulty('expert')}
              className={`px-3 py-1 rounded ${difficulty === 'expert' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Expert
            </button>
          </div>
          
          <button
            onClick={() => initializeGame(difficultySettings[difficulty])}
            className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
          >
            New Game
          </button>
        </div>
        
        <div className="flex justify-between bg-gray-200 dark:bg-gray-800 p-3 rounded mb-4">
          <div className="bg-black text-red-500 font-mono text-xl px-3 py-1 rounded">
            {minesLeft.toString().padStart(3, '0')}
          </div>
          
          <div className="flex items-center">
            {gameStatus === 'playing' && !firstClick && (
              <span className="text-2xl mr-2">🙂</span>
            )}
            {gameStatus === 'waiting' || firstClick ? (
              <span className="text-2xl mr-2">😊</span>
            ) : gameStatus === 'won' ? (
              <span className="text-2xl mr-2">😎</span>
            ) : (
              <span className="text-2xl mr-2">😵</span>
            )}
          </div>
          
          <div className="bg-black text-red-500 font-mono text-xl px-3 py-1 rounded">
            {formatTime(timer)}
          </div>
        </div>
      </div>
      
      <div 
        className="border-4 border-gray-400 inline-block"
        style={{ 
          maxWidth: '100%', 
          overflowX: 'auto'
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-8 h-8 flex items-center justify-center select-none
                  ${cell.isRevealed 
                    ? 'bg-gray-300 dark:bg-gray-700' 
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-350 dark:hover:bg-gray-550 cursor-pointer'}
                  border border-gray-500
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className="text-lg">💣</span>
                  ) : cell.neighborMines > 0 ? (
                    <span className={`font-bold ${getNumberColor(cell.neighborMines)}`}>
                      {cell.neighborMines}
                    </span>
                  ) : null
                ) : cell.isFlagged ? (
                  <span className="text-lg">🚩</span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {gameStatus === 'won' && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
          Congratulations! You found all the mines in {formatTime(timer)}!
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded">
          Game over! You hit a mine after {formatTime(timer)}.
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>Left click to reveal a cell. Right click to place a flag.</p>
      </div>
    </div>
  );
}
