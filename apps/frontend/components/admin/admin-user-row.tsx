'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminUpdateUser } from '@/hooks/use-admin-update-user';
import { useAuth } from '@/contexts/auth-context';
import { useUserReputation } from '@/hooks/use-user-reputation';
import { formatDate } from '@/lib/format';
import { ROLE_LABELS } from '@/lib/roles';
import { USER_STATUS_LABELS, USER_STATUS_VARIANTS } from '@/lib/user-status';
import type { User } from '@/types/api';
import { UserRole } from '@safecity/shared-types';

const ROLE_OPTIONS: UserRole[] = [
  UserRole.CIUDADANO,
  UserRole.MODERADOR,
  UserRole.ADMINISTRADOR,
];

export function AdminUserRow({ user }: { user: User }) {
  const { user: currentUser } = useAuth();
  const { data: reputation, isLoading: isReputationLoading } = useUserReputation(user.id);
  const adminUpdateUser = useAdminUpdateUser();

  const isSelf = currentUser?.id === user.id;
  const isSuspended = user.status === 'SUSPENDIDO';
  const actionsDisabled = isSelf || adminUpdateUser.isPending;

  function handleRoleChange(role: string) {
    adminUpdateUser.mutate({ id: user.id, payload: { role: role as UserRole } });
  }

  function handleToggleSuspend() {
    adminUpdateUser.mutate({
      id: user.id,
      payload: { status: isSuspended ? 'ACTIVO' : 'SUSPENDIDO' },
    });
  }

  return (
    <tr>
      <td className="px-3 py-2.5 font-medium">{user.name}</td>
      <td className="max-w-48 truncate px-3 py-2.5 text-muted-foreground">{user.email}</td>
      <td className="px-3 py-2.5">
        <Select
          value={user.role}
          onValueChange={handleRoleChange}
          disabled={actionsDisabled}
        >
          <SelectTrigger
            className="w-40"
            title={isSelf ? 'No puedes cambiar tu propio rol' : undefined}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-3 py-2.5">
        <Badge variant={USER_STATUS_VARIANTS[user.status]}>
          {USER_STATUS_LABELS[user.status]}
        </Badge>
      </td>
      <td className="px-3 py-2.5 text-muted-foreground">{formatDate(user.createdAt)}</td>
      <td className="px-3 py-2.5 text-muted-foreground">
        {isReputationLoading ? '…' : (reputation?.reputation ?? '—')}
      </td>
      <td className="px-3 py-2.5">
        <Button
          type="button"
          size="sm"
          variant={isSuspended ? 'outline' : 'destructive'}
          disabled={actionsDisabled || user.status === 'ELIMINADO'}
          title={isSelf ? 'No puedes suspender tu propia cuenta' : undefined}
          onClick={handleToggleSuspend}
        >
          {isSuspended ? 'Reactivar' : 'Suspender'}
        </Button>
      </td>
    </tr>
  );
}
