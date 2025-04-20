'use client';

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
}

export function GameCard({ title, description, icon }: GameCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="p-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Play Now
        </span>
      </div>
    </div>
  );
}
