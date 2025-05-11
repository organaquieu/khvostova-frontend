import { Suspense } from 'react';
import { ScrollHandler } from '@/components/shared/ScrollHandler';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Страница не найдена</p>
        <a href="/" className="text-blue-500 hover:underline">
          Вернуться на главную
        </a>
      </div>
      <Suspense>
        <ScrollHandler />
      </Suspense>
    </div>
  );
} 