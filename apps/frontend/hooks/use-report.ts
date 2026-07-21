'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports.api';

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', 'detail', id],
    queryFn: () => reportsApi.getById(id),
    enabled: Boolean(id),
  });
}
