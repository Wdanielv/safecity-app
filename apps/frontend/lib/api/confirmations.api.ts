import { apiClient } from './client';
import type { Confirmation } from '@/types/api';

export const confirmationsApi = {
  create: (reportId: string) =>
    apiClient
      .post<Confirmation>(`/reports/${reportId}/confirmations`)
      .then((res) => res.data),

  remove: (reportId: string) =>
    apiClient
      .delete<{ message: string }>(`/reports/${reportId}/confirmations`)
      .then((res) => res.data),
};
