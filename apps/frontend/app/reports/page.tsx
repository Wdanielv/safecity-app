import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { ReportsListContent } from '@/components/reports/reports-list-content';

export const metadata: Metadata = {
  title: 'Reportes | SAFECITY',
};

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ReportsListContent />
      </AppShell>
    </ProtectedRoute>
  );
}
