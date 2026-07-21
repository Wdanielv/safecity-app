'use client';

import { useQuery } from '@tanstack/react-query';
import { reputationApi } from '@/lib/api/reputation.api';

export function useReputation(enabled: boolean) {
  return useQuery({
    queryKey: ['reputation', 'me'],
    queryFn: reputationApi.getMine,
    enabled,
  });
}
