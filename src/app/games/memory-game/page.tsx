'use client';

import { MemoryGame } from '@/components/games/MemoryGame';
import { GameLayout } from '@/components/ui/GameLayout';

export default function MemoryGamePage() {
  return (
    <GameLayout title="Memory Card Game">
      <MemoryGame />
    </GameLayout>
  );
}
