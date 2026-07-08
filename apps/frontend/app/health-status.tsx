'use client';

import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

type HealthState =
  | { phase: 'loading' }
  | { phase: 'ok'; data: HealthResponse }
  | { phase: 'error'; message: string };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export function HealthStatus() {
  const [state, setState] = useState<HealthState>({ phase: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<HealthResponse>;
      })
      .then((data) => {
        if (!cancelled) setState({ phase: 'ok', data });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ phase: 'error', message: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.phase === 'loading') {
    return <p className="text-sm text-slate-500">Verificando conexión con la API…</p>;
  }

  if (state.phase === 'error') {
    return (
      <p className="text-sm text-red-600">
        No se pudo conectar con la API en {API_BASE_URL} ({state.message})
      </p>
    );
  }

  return (
    <p className="text-sm text-emerald-600">
      API conectada — {state.data.service} ({state.data.status})
    </p>
  );
}
