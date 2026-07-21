'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports.api';
import type { UpdateReportPayload } from '@/types/api';

export function useUpdateReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateReportPayload) => reportsApi.update(id, payload),
    onSuccess: (report) => {
      queryClient.setQueryData(['reports', 'detail', id], report);
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
  });
}
