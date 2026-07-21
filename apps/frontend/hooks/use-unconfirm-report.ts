'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmationsApi } from '@/lib/api/confirmations.api';

export function useUnconfirmReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
  });
}
