import type { ReportStatus } from '@safecity/shared-types';

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  DESCARTADO: 'Descartado',
  ARCHIVADO: 'Archivado',
};

export const REPORT_STATUS_VARIANTS: Record<
  ReportStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDIENTE: 'outline',
  CONFIRMADO: 'default',
  DESCARTADO: 'destructive',
  ARCHIVADO: 'secondary',
};
