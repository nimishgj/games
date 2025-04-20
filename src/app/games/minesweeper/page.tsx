'use client';

import { Minesweeper } from '@/components/games/Minesweeper';
import { GameLayout } from '@/components/ui/GameLayout';

export default function MinesweeperPage() {
  return (
    <GameLayout title="Minesweeper">
      <Minesweeper />
    </GameLayout>
  );
}
