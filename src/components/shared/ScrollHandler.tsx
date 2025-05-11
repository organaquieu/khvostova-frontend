'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function ScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Проверяем, есть ли якорь в URL
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, searchParams]);

  return null;
}