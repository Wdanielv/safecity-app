'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports.api';
import type { ReportsQuery } from '@/types/api';

export function useReports(query: ReportsQuery) {
  return useQuery({
    queryKey: ['reports', 'list', query],
    queryFn: () => reportsApi.list(query),
    placeholderData: keepPreviousData,
  });
}
