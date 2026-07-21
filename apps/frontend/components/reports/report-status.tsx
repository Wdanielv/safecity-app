import { Badge } from '@/components/ui/badge';
import { REPORT_STATUS_LABELS, REPORT_STATUS_VARIANTS } from '@/lib/report-status';
import type { ReportStatus as ReportStatusValue } from '@safecity/shared-types';

interface ReportStatusProps {
  status: ReportStatusValue;
}

export function ReportStatus({ status }: ReportStatusProps) {
  return <Badge variant={REPORT_STATUS_VARIANTS[status]}>{REPORT_STATUS_LABELS[status]}</Badge>;
}
