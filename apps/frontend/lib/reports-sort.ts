import type { Report } from '@/types/api';

const STATUS_ORDER: Record<Report['status'], number> = {
  PENDIENTE: 0,
  CONFIRMADO: 1,
  ARCHIVADO: 2,
  DESCARTADO: 3,
};

/**
 * Ordena únicamente los reportes ya cargados en la página actual.
 * SearchReportDto (backend) no expone un parámetro de orden: el servicio
 * siempre devuelve `orderBy: { createdAt: 'desc' }`.
 */
export function sortReports(reports: Report[], sort: string): Report[] {
  const sorted = [...reports];

  if (sort === 'oldest') {
    sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'status') {
    sorted.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  } else {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return sorted;
}

/**
 * Filtra por texto únicamente entre los reportes ya cargados en la página
 * actual. SearchReportDto (backend) no expone un parámetro de búsqueda.
 */
export function filterReportsBySearch(reports: Report[], search: string): Report[] {
  const term = search.trim().toLowerCase();
  if (!term) return reports;

  return reports.filter((report) => {
    const haystack = [
      report.description ?? '',
      report.incidentType.label,
      report.locality.name,
      report.neighborhood?.name ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}

export function filterOnlyMine(
  reports: Report[],
  userId: string | undefined,
  onlyMine: boolean,
): Report[] {
  if (!onlyMine || !userId) return reports;
  return reports.filter((report) => report.user?.id === userId);
}
