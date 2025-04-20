'use client';

import { useState, useEffect, useRef } from 'react';

interface WordData {
  original: string;
  hint?: string;
}

interface Word extends WordData {
  scrambled: string;
}

// Categories of words with their respective word lists
const wordCategories: Record<string, WordData[]> = {
  'Animals': [
    { original: 'elephant', hint: 'Large mammal with a trunk' },
    { original: 'giraffe', hint: 'Tallest living terrestrial animal' },
    { original: 'penguin', hint: 'Flightless bird that swims' },
    { original: 'dolphin', hint: 'Intelligent marine mammal' },
    { original: 'tiger', hint: 'Large cat with stripes' },
    { original: 'kangaroo', hint: 'Marsupial that hops' },
    { original: 'octopus', hint: 'Eight-armed sea creature' },
    { original: 'zebra', hint: 'Black and white striped equid' }
  ],
  'Countries': [
    { original: 'australia', hint: 'Home to kangaroos and koalas' },
    { original: 'brazil', hint: 'Famous for the Amazon rainforest' },
    { original: 'canada', hint: 'Known for maple syrup' },
    { original: 'denmark', hint: 'Scandinavian country' },
    { original: 'egypt', hint: 'Land of the pyramids' },
    { original: 'france', hint: 'Home of the Eiffel Tower' },
    { original: 'germany', hint: 'Known for its engineering' },
    { original: 'india', hint: 'Land of the Taj Mahal' }
  ],
  'Foods': [
    { original: 'pizza', hint: 'Italian dish with cheese and toppings' },
    { original: 'sushi', hint: 'Japanese dish with rice and fish' },
    { original: 'pasta', hint: 'Italian staple food' },
    { original: 'burger', hint: 'Popular fast food sandwich' },
    { original: 'chocolate', hint: 'Sweet treat made from cocoa' },
    { original: 'pancake', hint: 'Breakfast food that is flat and round' },
    { original: 'avocado', hint: 'Green fruit used in guacamole' },
    { original: 'waffle', hint: 'Checkered pattern breakfast food' }
  ],
  'Technology': [
    { original: 'computer', hint: 'Electronic device for processing data' },
    { original: 'internet', hint: 'Global network of connected computers' },
    { original: 'software', hint: 'Programs that tell computers what to do' },
    { original: 'database', hint: 'Organized collection of information' },
    { original: 'algorithm', hint: 'Step-by-step procedure for calculations' },
    { original: 'keyboard', hint: 'Used to type on computers' },
    { original: 'bluetooth', hint: 'Wireless technology for data exchange' },
    { original: 'website', hint: 'Collection of web pages on the internet' }
  ]
};

export function WordScramble() {
  const [categories, setCategories] = useState<string[]>(Object.keys(wordCategories));
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the game
  useEffect(() => {
    // Try to load best streak from localStorage
    const savedBestStreak = localStorage.getItem('word-scramble-best-streak');
    if (savedBestStreak) {
      setBestStreak(parseInt(savedBestStreak, 10));
    }
  }, []);

  // Save best streak when it changes
  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem('word-scramble-best-streak', streak.toString());
    }
  }, [streak, bestStreak]);

  // Scramble a word
  const scrambleWord = (word: string): string => {
    // Convert word to array, shuffle it, and join back
    const wordArray = word.split('');
    
    // Keep shuffling until the scrambled word is different from original
    let scrambled;
    do {
      // Fisher-Yates shuffle algorithm
      for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
      }
      scrambled = wordArray.join('');
    } while (scrambled === word);
    
    return scrambled;
  };

  // Get a random word from the selected category
  const getRandomWord = () => {
    if (!selectedCategory || availableWords.length === 0) return;

    // Get a random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    
    // Remove this word from available words to avoid repetition
    setAvailableWords(prev => prev.filter((_, index) => index !== randomIndex));

    // Scramble the word
    const scrambledWord = scrambleWord(selectedWord.original);
    
    setCurrentWord({
      original: selectedWord.original,
      scrambled: scrambledWord,
      hint: selectedWord.hint
    });
    
    setGuess('');
    setMessage('');
    setShowHint(false);
    
    // Focus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Select a category and start the game
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    // Add empty scrambled property to match Word interface
    const wordsWithScrambled = wordCategories[category as keyof typeof wordCategories].map(word => ({
      ...word,
      scrambled: ''
    }));
    setAvailableWords(wordsWithScrambled);
    setStreak(0);
    setGameStarted(true);
  };

  // Reset the game to select another category
  const resetGame = () => {
    setSelectedCategory('');
    setCurrentWord(null);
    setAvailableWords([]);
    setGuess('');
    setMessage('');
    setShowHint(false);
    setStreak(0);
    setGameStarted(false);
  };

  // Handle guess submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWord) return;
    
    if (guess.toLowerCase() === currentWord.original.toLowerCase()) {
      // Correct guess
      setMessage('Correct! Well done!');
      setMessageType('success');
      setStreak(prev => prev + 1);
      
      // Get next word after a short delay
      setTimeout(() => {
        if (availableWords.length > 0) {
          getRandomWord();
        } else {
          setMessage('You have completed all words in this category!');
          setMessageType('success');
        }
      }, 1500);
    } else {
      // Incorrect guess
      setMessage('Incorrect! Try again.');
      setMessageType('error');
      setStreak(0);
    }
  };

  // Refresh with a new word
  const handleNextWord = () => {
    // If there are no available words left, reset the category words
    if (availableWords.length === 0) {
      const wordsWithScrambled = wordCategories[selectedCategory as keyof typeof wordCategories].map(word => ({
        ...word,
        scrambled: ''
      }));
      setAvailableWords(wordsWithScrambled);
    }
    getRandomWord();
  };

  // Give up and show the answer
  const handleGiveUp = () => {
    if (!currentWord) return;
    
    setMessage(`The correct word was: ${currentWord.original}`);
    setMessageType('info');
    setStreak(0);
    
    // Get next word after a short delay
    setTimeout(() => {
      if (availableWords.length > 0) {
        getRandomWord();
      } else {
        // Add empty scrambled property to match Word interface
        const wordsWithScrambled = wordCategories[selectedCategory as keyof typeof wordCategories].map(word => ({
          ...word,
          scrambled: ''
        }));
        setAvailableWords(wordsWithScrambled);
        getRandomWord();
      }
    }, 2000);
  };

  // Start the game with the first word when a category is selected
  useEffect(() => {
    if (selectedCategory && availableWords.length > 0 && !currentWord) {
      getRandomWord();
    }
  }, [selectedCategory, availableWords, currentWord]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {!gameStarted ? (
        // Category selection screen
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Select a Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <button
                key={category}
                className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
                onClick={() => selectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Game screen
        <div className="w-full">
          <div className="flex justify-between mb-6">
            <div className="text-lg">
              <span className="font-semibold">Category:</span> {selectedCategory}
            </div>
            <div>
              <span className="mr-4">
                <span className="font-semibold">Streak:</span> {streak}
              </span>
              <span>
                <span className="font-semibold">Best:</span> {bestStreak}
              </span>
            </div>
          </div>
          
          {currentWord && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold tracking-wider mb-2">
                  {currentWord.scrambled.split('').map((char, index) => (
                    <span 
                      key={index}
                      className="inline-block mx-1 bg-blue-100 dark:bg-blue-900 p-2 rounded"
                    >
                      {char}
                    </span>
                  ))}
                </div>
                {showHint && currentWord.hint && (
                  <div className="text-gray-600 dark:text-gray-300 mt-2">
                    Hint: {currentWord.hint}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    ref={inputRef}
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    placeholder="Type your guess here"
                    className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
              
              {message && (
                <div 
                  className={`p-3 rounded mb-4 text-center ${
                    messageType === 'success' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' :
                    messageType === 'error' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200' :
                    'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                  }`}
                >
                  {message}
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowHint(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                  disabled={showHint}
                >
                  {showHint ? 'Hint Shown' : 'Show Hint'}
                </button>
                
                <div>
                  <button
                    onClick={handleGiveUp}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors mr-2"
                  >
                    Give Up
                  </button>
                  
                  <button
                    onClick={handleNextWord}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Next Word
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Change Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
