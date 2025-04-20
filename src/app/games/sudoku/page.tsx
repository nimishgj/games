'use client';

import { Sudoku } from '@/components/games/Sudoku';
import { GameLayout } from '@/components/ui/GameLayout';

export default function SudokuPage() {
  return (
    <GameLayout title="Sudoku">
      <Sudoku />
    </GameLayout>
  );
}
