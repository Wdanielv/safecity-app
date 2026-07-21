'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, FileSearch, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useReports } from '@/hooks/use-reports';
import { cn } from '@/lib/utils';
import { Pagination } from './pagination';
import { ReportCard } from './report-card';
import { ReportCardSkeleton } from './report-card-skeleton';

const PAGE_SIZE = 9;

export function MyReportsContent() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useReports({
    userId: user?.id,
    page,
    limit: PAGE_SIZE,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Reportes que has creado en SAFECITY.
          </p>
        </div>
        <Button asChild>
          <Link href="/reports/new">
            <Plus className="h-4 w-4" />
            Crear reporte
          </Link>
        </Button>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se pudieron cargar tus reportes</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Ocurrió un error al consultar la API. Intenta nuevamente.</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ReportCardSkeleton key={index} />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <FileSearch className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Todavía no has creado reportes</p>
            <p className="text-sm text-muted-foreground">
              Cuando reportes un incidente, aparecerá aquí.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/reports/new">Crear reporte</Link>
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
            isFetching && 'opacity-60',
          )}
        >
          {data.data.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
