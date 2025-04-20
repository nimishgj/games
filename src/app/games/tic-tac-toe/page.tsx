'use client';

import { TicTacToe } from '@/components/games/TicTacToe';
import { GameLayout } from '@/components/ui/GameLayout';

export default function TicTacToePage() {
  return (
    <GameLayout title="Tic Tac Toe">
      <TicTacToe />
    </GameLayout>
  );
}
