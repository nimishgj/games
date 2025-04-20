'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface GameLayoutProps {
  title: string;
  children: ReactNode;
}

export function GameLayout({ title, children }: GameLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Link 
          href="/games" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300"
        >
          Back to Games
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}
