'use client';

import { FlappyBird } from '@/components/games/FlappyBird';
import { GameLayout } from '@/components/ui/GameLayout';

export default function FlappyBirdPage() {
  return (
    <GameLayout title="Flappy Bird">
      <FlappyBird />
    </GameLayout>
  );
}
