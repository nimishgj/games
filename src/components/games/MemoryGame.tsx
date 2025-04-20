'use client';

import { useState, useEffect } from 'react';

// Card type definition
interface Card {
  id: number;
  content: string;
  flipped: boolean;
  matched: boolean;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝'
  ];
  
  // Initialize the game
  const initializeGame = () => {
    const totalPairs = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 12;
    const selectedEmojis = emojis.slice(0, totalPairs);
    
    // Create pairs of cards
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
      .map((content, index) => ({
        id: index,
        content,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5); // Shuffle the cards
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    setGameStarted(true);
  };
  
  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent action if game is over or card is already flipped or matched
    if (gameOver || flippedCards.length >= 2) return;
    
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;
    
    // Flip the card
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);
    
    // Add card to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = updatedCards.find(card => card.id === firstId);
      const secondCard = updatedCards.find(card => card.id === secondId);
      
      if (firstCard?.content === secondCard?.content) {
        // Cards match
        setTimeout(() => {
          const matchedCards = updatedCards.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, matched: true } 
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(prev => prev + 1);
          
          // Check if all pairs are matched
          const totalPairs = matchedCards.length / 2;
          if (matchedPairs + 1 === totalPairs) {
            setGameOver(true);
          }
        }, 500);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          const resetFlippedCards = updatedCards.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, flipped: false } 
              : card
          );
          setCards(resetFlippedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);
  
  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get card size based on difficulty
  const getCardSize = () => {
    switch(difficulty) {
      case 'easy': return 'w-24 h-24 md:w-28 md:h-28';
      case 'medium': return 'w-20 h-20 md:w-24 md:h-24';
      case 'hard': return 'w-16 h-16 md:w-20 md:h-20';
      default: return 'w-24 h-24';
    }
  };
  
  // Get grid layout based on difficulty
  const getGridLayout = () => {
    switch(difficulty) {
      case 'easy': return 'grid-cols-3 md:grid-cols-4';
      case 'medium': return 'grid-cols-4';
      case 'hard': return 'grid-cols-4 md:grid-cols-6';
      default: return 'grid-cols-4';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!gameStarted ? (
        <div className="w-full max-w-md mx-auto mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Memory Card Game</h2>
          <p className="mb-4 text-center">Match pairs of cards with the same symbol.</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Difficulty:</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded ${difficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Easy (12 cards)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded ${difficulty === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Medium (16 cards)
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded ${difficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Hard (24 cards)
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={initializeGame}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between w-full max-w-lg mb-4">
            <div className="text-lg font-semibold">Moves: {moves}</div>
            <div className="text-lg font-semibold">Time: {formatTime(timer)}</div>
            <div className="text-lg font-semibold">
              Pairs: {matchedPairs}/{cards.length / 2}
            </div>
          </div>
          
          <div className={`grid ${getGridLayout()} gap-4 mb-6`}>
            {cards.map(card => (
              <div
                key={card.id}
                className={`${getCardSize()} perspective-500`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${card.flipped ? 'rotate-y-180' : ''}`}>
                  {/* Card Back */}
                  <div className={`absolute w-full h-full bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer backface-hidden ${card.matched ? 'invisible' : ''}`}>
                    <div className="text-white text-3xl font-bold">?</div>
                  </div>
                  
                  {/* Card Front */}
                  <div className="absolute w-full h-full bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center backface-hidden rotate-y-180">
                    <div className="text-4xl">{card.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {gameOver && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
              <p>You completed the game in {moves} moves and {formatTime(timer)}!</p>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={initializeGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              New Game
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        </>
      )}
      
      <style jsx>{`
        .perspective-500 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
