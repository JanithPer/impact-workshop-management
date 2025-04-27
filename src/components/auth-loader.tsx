'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';

export function AuthLoader() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}