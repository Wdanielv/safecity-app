import { apiClient } from './client';
import type { Reputation } from '@/types/api';

export const reputationApi = {
  getMine: () => apiClient.get<Reputation>('/reputation/me').then((res) => res.data),
  getById: (userId: string) =>
    apiClient.get<Reputation>(`/reputation/${userId}`).then((res) => res.data),
};
