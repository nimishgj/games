'use client';

import { Snake } from '@/components/games/Snake';
import { GameLayout } from '@/components/ui/GameLayout';

export default function SnakePage() {
  return (
    <GameLayout title="Snake">
      <Snake />
    </GameLayout>
  );
}
