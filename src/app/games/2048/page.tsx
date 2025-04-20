'use client';

import { Game2048 } from '@/components/games/Game2048';
import { GameLayout } from '@/components/ui/GameLayout';

export default function Game2048Page() {
  return (
    <GameLayout title="2048">
      <Game2048 />
    </GameLayout>
  );
}
