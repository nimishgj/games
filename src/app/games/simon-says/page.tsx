'use client';

import { SimonSays } from '@/components/games/SimonSays';
import { GameLayout } from '@/components/ui/GameLayout';

export default function SimonSaysPage() {
  return (
    <GameLayout title="Simon Says">
      <SimonSays />
    </GameLayout>
  );
}
