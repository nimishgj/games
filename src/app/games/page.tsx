'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Local GameCard component
interface GameCardProps {
  title: string;
  description: string;
  icon: string;
}

function GameCard({ title, description, icon }: GameCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="p-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Play Now
        </span>
      </div>
    </div>
  );
}

// Define our game types
interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function GamesPage() {
  // Use state to manage games list to follow React best practices
  const [games, setGames] = useState<GameType[]>([]);

  // Load games on component mount
  useEffect(() => {
    // In a real app, this could come from an API
    const availableGames: GameType[] = [
      {
        id: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        description: 'Classic game of X and O. Get three in a row to win!',
        icon: '✖️⭕'
      },
      {
        id: 'flappy-bird',
        name: 'Flappy Bird',
        description: 'Navigate the bird through pipes by tapping to flap its wings.',
        icon: '🐦'
      },
      {
        id: 'sudoku',
        name: 'Sudoku',
        description: 'Fill the 9x9 grid with numbers following specific rules.',
        icon: '🔢'
      },
      {
        id: 'snake',
        name: 'Snake',
        description: 'Control a growing snake to eat apples without hitting walls or itself.',
        icon: '🐍'
      },
      {
        id: 'memory-game',
        name: 'Memory Game',
        description: 'Test your memory by matching pairs of cards with identical symbols.',
        icon: '🃏'
      },
      {
        id: 'minesweeper',
        name: 'Minesweeper',
        description: 'Clear a minefield without detonating any of the hidden mines.',
        icon: '💣'
      },
      {
        id: '2048',
        name: '2048',
        description: 'Slide numbered tiles and combine them to reach 2048.',
        icon: '🔢'
      },
      {
        id: 'word-scramble',
        name: 'Word Scramble',
        description: 'Unscramble the letters to form the correct word.',
        icon: '📖'
      },
      {
        id: 'simon-says',
        name: 'Simon Says',
        description: 'Remember and repeat the pattern of colors and sounds.',
        icon: '🎵'
      }
    ];
    setGames(availableGames);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Choose a Game</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id}>
            <GameCard
              title={game.name}
              description={game.description}
              icon={game.icon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
