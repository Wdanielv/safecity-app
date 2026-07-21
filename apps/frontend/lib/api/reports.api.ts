import { apiClient } from './client';
import type {
  CreateReportPayload,
  PaginatedResponse,
  Report,
  ReportsQuery,
  UpdateReportPayload,
} from '@/types/api';

export const reportsApi = {
  list: (query: ReportsQuery) =>
    apiClient
      .get<PaginatedResponse<Report>>('/reports', { params: query })
      .then((res) => res.data),

  getById: (id: string) => apiClient.get<Report>(`/reports/${id}`).then((res) => res.data),

  create: (payload: CreateReportPayload) =>
    apiClient.post<Report>('/reports', payload).then((res) => res.data),

  update: (id: string, payload: UpdateReportPayload) =>
    apiClient.put<Report>(`/reports/${id}`, payload).then((res) => res.data),

  remove: (id: string) =>
    apiClient.delete<{ message: string }>(`/reports/${id}`).then((res) => res.data),
};
