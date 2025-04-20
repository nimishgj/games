'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Game type definition
interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // In a real app, this could come from an API or database
    const availableGames: Game[] = [
      {
        id: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        description: 'Classic game of X and O. Get three in a row to win!',
        icon: '✖️⭕',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'flappy-bird',
        name: 'Flappy Bird',
        description: 'Navigate the bird through pipes by tapping to flap its wings.',
        icon: '🐦',
        color: 'from-green-500 to-lime-500'
      },
      {
        id: 'sudoku',
        name: 'Sudoku',
        description: 'Fill the 9x9 grid with numbers following specific rules.',
        icon: '🔢',
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'snake',
        name: 'Snake',
        description: 'Control a growing snake to eat apples without hitting walls or itself.',
        icon: '🐍',
        color: 'from-yellow-500 to-amber-500'
      },
      {
        id: 'memory-game',
        name: 'Memory Game',
        description: 'Test your memory by matching pairs of cards with identical symbols.',
        icon: '🃏',
        color: 'from-red-500 to-rose-500'
      },
      {
        id: 'minesweeper',
        name: 'Minesweeper',
        description: 'Clear a minefield without detonating any of the hidden mines.',
        icon: '💣',
        color: 'from-indigo-500 to-violet-500'
      },
      {
        id: '2048',
        name: '2048',
        description: 'Slide numbered tiles and combine them to reach 2048.',
        icon: '🔢',
        color: 'from-orange-500 to-amber-400'
      },
      {
        id: 'word-scramble',
        name: 'Word Scramble',
        description: 'Unscramble the letters to form the correct word.',
        icon: '📖',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        id: 'simon-says',
        name: 'Simon Says',
        description: 'Remember and repeat the pattern of colors and sounds.',
        icon: '🎵',
        color: 'from-blue-600 to-blue-400'
      }
    ];
    setGames(availableGames);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-900 to-indigo-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block">Game Collection</span>
            <span className="text-blue-300">Fun at Your Fingertips</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Explore our collection of classic games reimagined with modern web technologies.
            Challenge yourself or compete with friends!
          </p>
          <Link 
            href="/games"
            className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-colors duration-300"
          >
            Play Now
          </Link>
        </div>
      </section>
      
      {/* Featured Games */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Games</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <Link
                href={`/games/${game.id}`}
                key={game.id}
                className="group"
              >
                <div className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-gradient-to-br ${game.color}`}>
                  <div className="p-6 flex flex-col items-center justify-center text-white flex-grow text-center">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                    <p className="mb-4">{game.description}</p>
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-white/30 transition-colors">
                      Play Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Built With Modern Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-blue-500">⚡</div>
              <h3 className="text-xl font-bold mb-2">Next.js Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with Next.js for fast loading, great performance and an excellent user experience.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-blue-500">📱</div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Play on any device with our responsive interface that adapts to your screen size.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-blue-500">🧩</div>
              <h3 className="text-xl font-bold mb-2">Component-Based</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built using SOLID principles with modular, reusable components.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Dive into our collection of games and start having fun today!
          </p>
          <Link 
            href="/games" 
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-colors duration-300"
          >
            Browse All Games
          </Link>
        </div>
      </section>
    </main>
  );
}
