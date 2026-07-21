import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { MyReportsContent } from '@/components/reports/my-reports-content';

export const metadata: Metadata = {
  title: 'Mis Reportes | SAFECITY',
};

export default function MyReportsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <MyReportsContent />
      </AppShell>
    </ProtectedRoute>
  );
}
