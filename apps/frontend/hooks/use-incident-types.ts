'use client';

import { useQuery } from '@tanstack/react-query';
import { incidentTypesApi } from '@/lib/api/incident-types.api';

export function useIncidentTypes() {
  return useQuery({
    queryKey: ['incident-types'],
    queryFn: () => incidentTypesApi.list({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });
}
