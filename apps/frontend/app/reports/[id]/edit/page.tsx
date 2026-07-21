import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { ReportEditContent } from '@/components/reports/report-edit-content';

export const metadata: Metadata = {
  title: 'Editar reporte | SAFECITY',
};

interface ReportEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportEditPage({ params }: ReportEditPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <AppShell>
        <ReportEditContent reportId={id} />
      </AppShell>
    </ProtectedRoute>
  );
}
