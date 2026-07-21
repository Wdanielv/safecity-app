'use client';

import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports.api';
import type { PaginatedResponse, Report } from '@/types/api';

interface DeleteReportContext {
  previousLists: Array<[QueryKey, PaginatedResponse<Report> | undefined]>;
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, unknown, string, DeleteReportContext>({
    mutationFn: (id: string) => reportsApi.remove(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['reports', 'list'] });

      const previousLists = queryClient.getQueriesData<PaginatedResponse<Report>>({
        queryKey: ['reports', 'list'],
      });

      previousLists.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<Report>>(queryKey, {
          ...data,
          data: data.data.filter((report) => report.id !== id),
          meta: { ...data.meta, total: Math.max(0, data.meta.total - 1) },
        });
      });

      return { previousLists };
    },

    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
  });
}
