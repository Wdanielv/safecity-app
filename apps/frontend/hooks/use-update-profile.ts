'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type UpdateProfilePayload } from '@/lib/api/users.api';
import { useAuth } from '@/contexts/auth-context';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateMe(payload),
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
