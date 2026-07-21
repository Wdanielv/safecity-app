import type { UserStatus } from '@/types/api';

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  PENDIENTE_VERIFICACION: 'Pendiente de verificación',
  ACTIVO: 'Activo',
  SUSPENDIDO: 'Suspendido',
  ELIMINADO: 'Eliminado',
};

export const USER_STATUS_VARIANTS: Record<
  UserStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDIENTE_VERIFICACION: 'outline',
  ACTIVO: 'default',
  SUSPENDIDO: 'destructive',
  ELIMINADO: 'secondary',
};
