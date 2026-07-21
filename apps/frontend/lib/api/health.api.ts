import { apiClient } from './client';
import type { HealthResponse } from '@/types/api';

export const healthApi = {
  check: () => apiClient.get<HealthResponse>('/health').then((res) => res.data),
};
