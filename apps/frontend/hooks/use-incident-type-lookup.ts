'use client';

import { useMemo } from 'react';
import { useIncidentTypes } from './use-incident-types';
import type { IncidentType } from '@/types/api';

/**
 * GET /reports solo devuelve {id, code, label} para el tipo de incidente
 * (ver ReportResponseDto), sin icon/color. Este hook reutiliza la lista
 * completa de /incident-types (ya cacheada) para resolver esos campos por id.
 */
export function useIncidentTypeLookup(): Map<string, IncidentType> {
  const { data } = useIncidentTypes();

  return useMemo(() => {
    const map = new Map<string, IncidentType>();
    for (const incidentType of data?.data ?? []) {
      map.set(incidentType.id, incidentType);
    }
    return map;
  }, [data]);
}
