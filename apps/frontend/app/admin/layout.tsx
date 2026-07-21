import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppShell } from '@/components/layout/app-shell';
import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata: Metadata = {
  title: 'Administración | SAFECITY',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>
        <AdminGuard>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Administración</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona usuarios, reportes y catálogos de la plataforma.
              </p>
            </div>
            <AdminNav />
            {children}
          </div>
        </AdminGuard>
      </AppShell>
    </ProtectedRoute>
  );
}
