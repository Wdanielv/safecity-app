'use client';

import { useQuery } from '@tanstack/react-query';
import { reputationApi } from '@/lib/api/reputation.api';

export function useUserReputation(userId: string | undefined) {
  return useQuery({
    queryKey: ['reputation', 'user', userId],
    queryFn: () => reputationApi.getById(userId as string),
    enabled: Boolean(userId),
  });
}
