'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useReport } from '@/hooks/use-report';
import { ReportForm } from './report-form';

export function ReportEditContent({ reportId }: { reportId: string }) {
  const { user } = useAuth();
  const { data: report, isLoading, isError } = useReport(reportId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar el reporte</AlertTitle>
        <AlertDescription>Verifica el enlace o vuelve al listado de reportes.</AlertDescription>
      </Alert>
    );
  }

  const canEdit = user?.id === report.user?.id && report.status === 'PENDIENTE';

  if (!canEdit) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Este reporte no se puede editar</AlertTitle>
        <AlertDescription>
          Solo el autor puede editarlo, y únicamente mientras esté en estado &quot;Pendiente&quot;.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href={`/reports/${reportId}`}>
          <ArrowLeft className="h-4 w-4" />
          Volver al reporte
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar reporte</h1>
        <p className="text-sm text-muted-foreground">
          Solo puedes actualizar la descripción mientras el reporte esté pendiente.
        </p>
      </div>
      <ReportForm mode="edit" report={report} />
    </div>
  );
}
