import { Suspense } from 'react';
import CartContent from '@/components/cart/CartContent';
import { ScrollHandler } from '@/components/shared/ScrollHandler';

export default function CartPage() {
  return (
    <>
      <Suspense>
        <CartContent />
      </Suspense>
      <Suspense>
        <ScrollHandler />
      </Suspense>
    </>
  );
}