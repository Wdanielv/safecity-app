import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { CreateReportContent } from '@/components/reports/create-report-content';

export const metadata: Metadata = {
  title: 'Crear reporte | SAFECITY',
};

export default function NewReportPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <CreateReportContent />
      </AppShell>
    </ProtectedRoute>
  );
}
