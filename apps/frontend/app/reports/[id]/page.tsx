import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { ReportDetailContent } from '@/components/reports/report-detail-content';

export const metadata: Metadata = {
  title: 'Detalle del reporte | SAFECITY',
};

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <AppShell>
        <ReportDetailContent reportId={id} />
      </AppShell>
    </ProtectedRoute>
  );
}
