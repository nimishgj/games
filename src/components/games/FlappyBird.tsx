'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Pipe extends GameObject {
  passed: boolean;
}

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game state using refs to avoid re-renders during animation
  const birdRef = useRef<GameObject>({
    x: 50,
    y: 200,
    width: 30,
    height: 24
  });
  const pipesRef = useRef<Pipe[]>([]);
  const velocityRef = useRef(0);
  const frameIdRef = useRef<number>(0);
  const lastPipeTimeRef = useRef(0);

  // Game constants
  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -10;
  const PIPE_SPEED = 3;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const PIPE_INTERVAL = 1500; // ms between pipe spawns

  // Initialize the game
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    birdRef.current = {
      x: 50,
      y: 200,
      width: 30,
      height: 24
    };
    pipesRef.current = [];
    velocityRef.current = 0;
    lastPipeTimeRef.current = 0;
    setScore(0);
    setGameOver(false);
  }, []);

  // Start game loop
  const startGame = useCallback(() => {
    if (gameStarted) return;
    
    initGame();
    setGameStarted(true);
  }, [gameStarted, initGame]);
  
  // Effect to start/stop game loop based on game state
  useEffect(() => {
    let animationId: number;
    
    if (gameStarted && !gameOver) {
      // Start the animation loop
      animationId = requestAnimationFrame(handleGameLoop);
      frameIdRef.current = animationId;
    }
    
    // Cleanup function to cancel animation when component unmounts or game state changes
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameStarted, gameOver]);

  // Jump action
  const jump = useCallback(() => {
    if (gameOver) {
      startGame();
      setGameStarted(true);
      return;
    }

    if (!gameStarted) {
      startGame();
      return;
    }

    velocityRef.current = JUMP_STRENGTH;
  }, [gameOver, gameStarted, startGame]);

  // Create a new pipe pair
  const createPipe = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const height = canvas.height;
    const gapPosition = Math.random() * (height - PIPE_GAP - 100) + 50;
    
    const topPipe: Pipe = {
      x: canvas.width,
      y: 0,
      width: PIPE_WIDTH,
      height: gapPosition,
      passed: false
    };
    
    const bottomPipe: Pipe = {
      x: canvas.width,
      y: gapPosition + PIPE_GAP,
      width: PIPE_WIDTH,
      height: height - gapPosition - PIPE_GAP,
      passed: false
    };
    
    pipesRef.current.push(topPipe, bottomPipe);
  }, []);

  // Check for collisions
  const checkCollision = useCallback(() => {
    const bird = birdRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return false;
    
    // Check for floor/ceiling collision
    if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
      return true;
    }
    
    // Check for pipe collision
    return pipesRef.current.some(pipe => {
      return (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width &&
        bird.y + bird.height > pipe.y &&
        bird.y < pipe.y + pipe.height
      );
    });
  }, []);

  // Main game loop - Declare function first to avoid reference issues
  function handleGameLoop(timestamp: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !gameStarted || gameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update bird
    const bird = birdRef.current;
    velocityRef.current += GRAVITY;
    bird.y += velocityRef.current;
    
    // Generate pipes
    if (timestamp - lastPipeTimeRef.current > PIPE_INTERVAL) {
      createPipe();
      lastPipeTimeRef.current = timestamp;
    }
    
    // Update pipes
    const pipes = pipesRef.current;
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= PIPE_SPEED;
      
      // Check if bird passed the pipe
      if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
        pipes[i].passed = true;
        if (i % 2 === 0) { // Only count score once per pipe pair
          setScore(prev => prev + 1);
        }
      }
    }
    
    // Remove off-screen pipes
    pipesRef.current = pipes.filter(pipe => pipe.x + pipe.width > 0);
    
    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw pipes
    ctx.fillStyle = '#2E8B57';
    pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(
      bird.x + bird.width/2,
      bird.y + bird.height/2,
      bird.width/2,
      bird.height/2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Check for collision
    if (checkCollision()) {
      setGameOver(true);
      setHighScore(prev => Math.max(prev, score));
      cancelAnimationFrame(frameIdRef.current);
      return;
    }
    
    frameIdRef.current = requestAnimationFrame(gameLoop);
  }
  
  // Create memoized version of game loop
  const gameLoop = useCallback(handleGameLoop, [createPipe, checkCollision, gameOver, gameStarted, score]);

  // Handle keyboard and touch events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(frameIdRef.current);
  }, []);

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click or Press Space to Start', canvas.width / 2, canvas.height / 2);
      }
    }
  }, []);

  // Restart game when gameOver changes
  useEffect(() => {
    if (gameOver && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvasRef.current.width / 2, canvasRef.current.height / 2 - 50);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Score: ${score}`, canvasRef.current.width / 2, canvasRef.current.height / 2);
        ctx.fillText(`High Score: ${Math.max(highScore, score)}`, canvasRef.current.width / 2, canvasRef.current.height / 2 + 40);
        
        ctx.font = '20px Arial';
        ctx.fillText('Click or Press Space to Restart', canvasRef.current.width / 2, canvasRef.current.height / 2 + 90);
      }
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-lg">
        {!gameStarted ? 'Click to Start' : gameOver ? `Game Over! Score: ${score}` : `Score: ${score}`}
      </div>
      <canvas 
        ref={canvasRef}
        onClick={jump}
        className="border-2 border-gray-300 rounded-md"
      />
      <div className="mt-4 text-sm text-gray-500">
        Press Space or Click/Tap to make the bird flap!
      </div>
    </div>
  );
}
