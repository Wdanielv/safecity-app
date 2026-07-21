import { apiClient } from './client';
import type { AuthResponse } from '@/types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((res) => res.data),

  logout: () =>
    apiClient.delete<{ message: string }>('/auth/logout').then((res) => res.data),
};
