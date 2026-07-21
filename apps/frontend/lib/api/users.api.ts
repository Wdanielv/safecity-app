import { apiClient } from './client';
import type { PaginatedResponse, User, UserStatus } from '@/types/api';
import type { UserRole } from '@safecity/shared-types';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  photoUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
}

export interface AdminUpdateUserPayload {
  role?: UserRole;
  status?: UserStatus;
}

export const usersApi = {
  getMe: () => apiClient.get<User>('/users/me').then((res) => res.data),

  updateMe: (payload: UpdateProfilePayload) =>
    apiClient.patch<User>('/users/me', payload).then((res) => res.data),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient
      .patch<{ message: string }>('/users/me/password', payload)
      .then((res) => res.data),

  adminList: (query: AdminUsersQuery) =>
    apiClient
      .get<PaginatedResponse<User>>('/users', { params: query })
      .then((res) => res.data),

  adminUpdateUser: (id: string, payload: AdminUpdateUserPayload) =>
    apiClient.patch<User>(`/users/${id}`, payload).then((res) => res.data),
};
