'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на модальное окно
    router.push(`/product/${params.id}?modal=true`);
  }, [params.id, router]);

  return null; // Компонент не рендерит ничего, так как происходит редирект
}
