'use client';

import { useIncidentTypeLookup } from '@/hooks/use-incident-type-lookup';
import { DEFAULT_INCIDENT_COLOR, getIncidentIcon } from '@/lib/incident-icons';
import type { IncidentTypeSummary } from '@/types/api';

interface ReportBadgeProps {
  incidentType: IncidentTypeSummary;
}

export function ReportBadge({ incidentType }: ReportBadgeProps) {
  const lookup = useIncidentTypeLookup();
  const fullType = lookup.get(incidentType.id);
  const Icon = getIncidentIcon(incidentType.code);
  const color = fullType?.color ?? DEFAULT_INCIDENT_COLOR;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium">
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className="shrink-0">
        <circle cx="4" cy="4" r="4" fill={color} />
      </svg>
      {/* eslint-disable-next-line react-hooks/static-components -- Icon viene de un lookup table estático (lib/incident-icons.ts): siempre resuelve al mismo componente ya existente, nunca crea uno nuevo. */}
      <Icon className="h-3.5 w-3.5" />
      {incidentType.label}
    </span>
  );
}
