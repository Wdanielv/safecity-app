'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports.api';

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.create,
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
      queryClient.setQueryData(['reports', 'detail', report.id], report);
    },
  });
}
