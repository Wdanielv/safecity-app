'use client';

import { useQuery } from '@tanstack/react-query';
import { neighborhoodsApi } from '@/lib/api/neighborhoods.api';

// La localidad con más barrios (Suba) tiene ~111; 200 deja margen sin
// necesidad de paginar el selector. Cada consulta sigue filtrada por
// localidad, nunca trae los ~1000 barrios de la ciudad de una vez.
const NEIGHBORHOODS_PER_LOCALITY_LIMIT = 200;

export function useNeighborhoods(localityId: string | undefined) {
  return useQuery({
    queryKey: ['neighborhoods', localityId],
    queryFn: () =>
      neighborhoodsApi.list({ localityId, limit: NEIGHBORHOODS_PER_LOCALITY_LIMIT }),
    enabled: Boolean(localityId),
    staleTime: 5 * 60 * 1000,
  });
}
