'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, FileSearch, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useReports } from '@/hooks/use-reports';
import { cn } from '@/lib/utils';
import { filterOnlyMine, filterReportsBySearch, sortReports } from '@/lib/reports-sort';
import type { ReportStatus } from '@safecity/shared-types';
import { INCIDENT_TYPE_ALL } from './incident-type-select';
import { LOCALITY_ALL } from './locality-select';
import { Pagination } from './pagination';
import { ReportCard } from './report-card';
import { ReportCardSkeleton } from './report-card-skeleton';
import { ReportFilters, SORT_NEWEST, STATUS_ALL, type ReportFiltersValue } from './report-filters';

const DEFAULT_FILTERS: ReportFiltersValue = {
  search: '',
  incidentTypeId: INCIDENT_TYPE_ALL,
  localityId: LOCALITY_ALL,
  status: STATUS_ALL,
  sort: SORT_NEWEST,
  onlyMine: false,
};

const PAGE_SIZE = 9;

export function ReportsListContent() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ReportFiltersValue>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const query = {
    page,
    limit: PAGE_SIZE,
    ...(filters.incidentTypeId !== INCIDENT_TYPE_ALL && { incidentTypeId: filters.incidentTypeId }),
    ...(filters.localityId !== LOCALITY_ALL && { localityId: filters.localityId }),
    ...(filters.status !== STATUS_ALL && { status: filters.status as ReportStatus }),
  };

  const { data, isLoading, isError, isFetching, refetch } = useReports(query);

  function handleFiltersChange(next: ReportFiltersValue) {
    setFilters(next);
    setPage(1);
  }

  const visibleReports = data
    ? sortReports(
        filterOnlyMine(filterReportsBySearch(data.data, filters.search), user?.id, filters.onlyMine),
        filters.sort,
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Incidentes reportados por la comunidad de SAFECITY.
          </p>
        </div>
        <Button asChild>
          <Link href="/reports/new">
            <Plus className="h-4 w-4" />
            Crear reporte
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <ReportFilters value={filters} onChange={handleFiltersChange} />
        <p className="text-xs text-muted-foreground">
          La búsqueda, el orden y &quot;Solo mis reportes&quot; se aplican solo sobre los reportes ya
          cargados en esta página: la API actual (GET /reports) no expone esos parámetros.
        </p>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se pudieron cargar los reportes</AlertTitle>
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
      ) : visibleReports.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <FileSearch className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No hay reportes que coincidan</p>
            <p className="text-sm text-muted-foreground">
              Ajusta los filtros o crea el primer reporte de esta zona.
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
          {visibleReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
