'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type AdminUpdateUserPayload } from '@/lib/api/users.api';

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUpdateUserPayload }) =>
      usersApi.adminUpdateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
