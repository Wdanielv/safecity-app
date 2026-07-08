'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch((error: Error) => {
      console.error('No se pudo registrar el Service Worker:', error.message);
    });
  }, []);

  return null;
}
