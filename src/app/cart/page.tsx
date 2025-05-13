'use client';

import { Suspense } from 'react';
import CartContent from '@/components/cart/CartContent';
import { ScrollHandler } from '@/components/shared/ScrollHandler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function CartPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <CartContent />
      </Suspense>
      <Suspense>
        <ScrollHandler />
      </Suspense>
    </QueryClientProvider>
  );
}