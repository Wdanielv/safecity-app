import { apiClient } from './client';
import type { Neighborhood, NeighborhoodsQuery, PaginatedResponse } from '@/types/api';

export const neighborhoodsApi = {
  list: (query: NeighborhoodsQuery = {}) =>
    apiClient
      .get<PaginatedResponse<Neighborhood>>('/neighborhoods', { params: query })
      .then((res) => res.data),
};
