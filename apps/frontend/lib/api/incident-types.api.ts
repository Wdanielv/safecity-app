import { apiClient } from './client';
import type { IncidentType, IncidentTypesQuery, PaginatedResponse } from '@/types/api';

export const incidentTypesApi = {
  list: (query: IncidentTypesQuery = {}) =>
    apiClient
      .get<PaginatedResponse<IncidentType>>('/incident-types', { params: query })
      .then((res) => res.data),
};
