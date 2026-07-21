import { apiClient } from './client';
import type { Locality, LocalitiesQuery, PaginatedResponse } from '@/types/api';

export const localitiesApi = {
  list: (query: LocalitiesQuery = {}) =>
    apiClient
      .get<PaginatedResponse<Locality>>('/localities', { params: query })
      .then((res) => res.data),
};
