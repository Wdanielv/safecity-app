'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersApi, type AdminUsersQuery } from '@/lib/api/users.api';

export function useAdminUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: ['admin', 'users', 'list', query],
    queryFn: () => usersApi.adminList(query),
    placeholderData: keepPreviousData,
  });
}
