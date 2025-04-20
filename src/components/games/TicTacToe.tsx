'use client';

import { useState, useEffect } from 'react';

// Type definitions for better type safety
type Player = 'X' | 'O' | null;
type BoardState = Player[];

interface TicTacToeProps {
  onGameEnd?: (winner: Player) => void;
}

export function TicTacToe({ onGameEnd }: TicTacToeProps) {
  // State for the board, current player, winner, and game status
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [draws, setDraws] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  // Check for winner after each move
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      setScores(prev => ({ 
        ...prev, 
        [winner]: prev[winner as keyof typeof prev] + 1 
      }));
      onGameEnd?.(winner);
    } else if (board.every(cell => cell !== null)) {
      // Game is a draw
      setGameOver(true);
      setDraws(prev => prev + 1);
      onGameEnd?.(null);
    }
  }, [board, onGameEnd]);

  // Handle cell click
  const handleClick = (index: number) => {
    // Don't allow moves on filled cells or when game is over
    if (board[index] !== null || gameOver) {
      return;
    }

    // Create a new board with the move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Switch to the next player
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
  };

  // Calculate winner based on board state
  const calculateWinner = (board: BoardState): Player => {
    const lines = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Render a single cell
  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <button
        className={`w-20 h-20 text-4xl font-bold border-2 border-gray-300 flex items-center justify-center transition-colors
          ${value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : ''}
          ${!value && !gameOver ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
        `}
        onClick={() => handleClick(index)}
        disabled={gameOver || board[index] !== null}
      >
        {value}
      </button>
    );
  };

  // Get game status message
  const getStatusMessage = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (gameOver) {
      return 'Game ended in a draw!';
    } else {
      return `Current player: ${currentPlayer}`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">{getStatusMessage()}</div>
        <div className="flex justify-center gap-4">
          <div className="text-blue-500">X: {scores.X}</div>
          <div className="text-gray-500">Draws: {draws}</div>
          <div className="text-red-500">O: {scores.O}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {Array(9).fill(null).map((_, index) => (
          <div key={index}>{renderCell(index)}</div>
        ))}
      </div>
      
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
}
