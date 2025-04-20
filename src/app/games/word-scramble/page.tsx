'use client';

import { WordScramble } from '@/components/games/WordScramble';
import { GameLayout } from '@/components/ui/GameLayout';

export default function WordScramblePage() {
  return (
    <GameLayout title="Word Scramble">
      <WordScramble />
    </GameLayout>
  );
}
