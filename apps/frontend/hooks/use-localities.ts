'use client';

import { useQuery } from '@tanstack/react-query';
import { localitiesApi } from '@/lib/api/localities.api';

export function useLocalities() {
  return useQuery({
    queryKey: ['localities'],
    queryFn: () => localitiesApi.list({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });
}
