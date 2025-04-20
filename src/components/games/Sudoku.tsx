'use client';

import { useState, useEffect, useCallback } from 'react';

type SudokuGrid = (number | null)[][];
type CellCoord = { row: number; col: number };

export function Sudoku() {
  const [originalGrid, setOriginalGrid] = useState<SudokuGrid>([]);
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'invalid'>('playing');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Generate a new Sudoku puzzle
  const generatePuzzle = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    // Reset game state
    setSelectedCell(null);
    setGameStatus('playing');
    setTimer(0);
    setIsTimerRunning(true);

    // Create a solved Sudoku grid
    const solvedGrid = createSolvedGrid();
    
    // Remove numbers based on difficulty
    let cellsToRemove: number;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 30; // ~35% cells empty
        break;
      case 'medium':
        cellsToRemove = 45; // ~50% cells empty
        break;
      case 'hard':
        cellsToRemove = 55; // ~60% cells empty
        break;
      default:
        cellsToRemove = 30;
    }

    // Create a copy of the solved grid
    const puzzle: SudokuGrid = JSON.parse(JSON.stringify(solvedGrid));
    
    // Remove numbers randomly
    let count = 0;
    while (count < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        count++;
      }
    }
    
    // Set the grids
    setOriginalGrid(JSON.parse(JSON.stringify(puzzle)));
    setGrid(puzzle);
  }, []);

  // Create a solved Sudoku grid
  const createSolvedGrid = (): SudokuGrid => {
    // Initialize empty 9x9 grid
    const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Try to solve the puzzle (this is a simplified backtracking solver)
    solveSudoku(grid);
    
    return grid;
  };

  // Sudoku solver using backtracking
  const solveSudoku = (grid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // Find an empty cell
        if (grid[row][col] === null) {
          // Try placing numbers 1-9
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            // Check if number can be placed
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              // Recursively try to solve rest of the grid
              if (solveSudoku(grid)) {
                return true;
              }
              
              // If placing the number doesn't lead to a solution, backtrack
              grid[row][col] = null;
            }
          }
          // No number can be placed in this cell, need to backtrack
          return false;
        }
      }
    }
    // Grid is filled
    return true;
  };

  // Check if number can be placed at the given position
  const isValidPlacement = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[boxRow + r][boxCol + c] === num) return false;
      }
    }
    
    return true;
  };

  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Handle cell selection
  const handleCellClick = (row: number, col: number) => {
    // Can't modify original cells
    if (originalGrid[row][col] !== null) return;
    
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (num: number | null) => {
    if (!selectedCell || gameStatus !== 'playing') return;
    
    const { row, col } = selectedCell;
    
    // Can't modify original cells
    if (originalGrid[row][col] !== null) return;
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[row][col] = num;
    setGrid(newGrid);
    
    // Check if the grid is completed and valid
    if (isFull(newGrid)) {
      if (isValid(newGrid)) {
        setGameStatus('completed');
        setIsTimerRunning(false);
      } else {
        setGameStatus('invalid');
      }
    }
  };

  // Check if the grid is completely filled
  const isFull = (grid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) return false;
      }
    }
    return true;
  };

  // Check if the grid is valid
  const isValid = (grid: SudokuGrid): boolean => {
    // Check each row
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const cell = grid[row][col];
        if (cell === null || seen.has(cell)) return false;
        seen.add(cell);
      }
    }
    
    // Check each column
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const cell = grid[row][col];
        if (cell === null || seen.has(cell)) return false;
        seen.add(cell);
      }
    }
    
    // Check each 3x3 box
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const seen = new Set();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const cell = grid[boxRow + row][boxCol + col];
            if (cell === null || seen.has(cell)) return false;
            seen.add(cell);
          }
        }
      }
    }
    
    return true;
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Initialize game on mount
  useEffect(() => {
    generatePuzzle(difficulty);
  }, [difficulty, generatePuzzle]);

  // Get cell class based on position and selection status
  const getCellClass = (row: number, col: number): string => {
    let className = 'w-10 h-10 flex items-center justify-center border transition-colors';
    
    // Highlight selected cell
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      className += ' bg-blue-200 dark:bg-blue-800';
    }
    
    // Highlight cells in the same row, column, and box as the selected cell
    if (selectedCell && (selectedCell.row === row || selectedCell.col === col || 
        (Math.floor(row / 3) === Math.floor(selectedCell.row / 3) && 
         Math.floor(col / 3) === Math.floor(selectedCell.col / 3)))) {
      className += ' bg-blue-50 dark:bg-blue-900';
    }
    
    // Add border styling
    if (row % 3 === 0 && row !== 0) {
      className += ' border-t-2 border-t-black';
    }
    if (col % 3 === 0 && col !== 0) {
      className += ' border-l-2 border-l-black';
    }
    
    // Original cells (given) have different styling
    if (originalGrid[row]?.[col] !== null) {
      className += ' font-bold bg-gray-100 dark:bg-gray-700';
    } else {
      className += ' cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700';
    }
    
    return className;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-between w-full max-w-md">
        <div className="flex space-x-2">
          <button
            onClick={() => setDifficulty('easy')}
            className={`px-3 py-1 rounded ${difficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className={`px-3 py-1 rounded ${difficulty === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className={`px-3 py-1 rounded ${difficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Hard
          </button>
        </div>
        
        <div className="text-lg font-mono">
          {formatTime(timer)}
        </div>
      </div>
      
      <div className="mb-6 border-2 border-black">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={getCellClass(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== null && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-blue-700"
            disabled={gameStatus !== 'playing'}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(null)}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-red-100 dark:hover:bg-red-700"
          disabled={gameStatus !== 'playing'}
        >
          ✕
        </button>
      </div>
      
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => generatePuzzle(difficulty)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          New Game
        </button>
      </div>
      
      {gameStatus === 'completed' && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
          Congratulations! You solved the puzzle in {formatTime(timer)}!
        </div>
      )}
      
      {gameStatus === 'invalid' && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded">
          There are errors in your solution. Please check again.
        </div>
      )}
    </div>
  );
}
