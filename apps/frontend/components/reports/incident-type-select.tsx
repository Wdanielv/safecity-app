'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIncidentTypes } from '@/hooks/use-incident-types';

export const INCIDENT_TYPE_ALL = '__all__';

interface IncidentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  allowAll?: boolean;
  allLabel?: string;
}

export function IncidentTypeSelect({
  value,
  onChange,
  disabled,
  allowAll,
  allLabel = 'Todos los tipos',
}: IncidentTypeSelectProps) {
  const { data, isLoading, isError } = useIncidentTypes();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || isLoading || isError}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading
              ? 'Cargando tipos…'
              : isError
                ? 'No se pudieron cargar los tipos'
                : 'Selecciona un tipo de incidente'
          }
        />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value={INCIDENT_TYPE_ALL}>{allLabel}</SelectItem>}
        {data?.data.map((incidentType) => (
          <SelectItem key={incidentType.id} value={incidentType.id}>
            {incidentType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
