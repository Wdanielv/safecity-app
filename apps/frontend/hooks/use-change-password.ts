'use client';

import { useMutation } from '@tanstack/react-query';
import { usersApi, type ChangePasswordPayload } from '@/lib/api/users.api';

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => usersApi.changePassword(payload),
  });
}
