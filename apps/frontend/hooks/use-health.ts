'use client';

import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/health.api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthApi.check,
    retry: 1,
    refetchInterval: 30_000,
  });
}
