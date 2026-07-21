'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNeighborhoods } from '@/hooks/use-neighborhoods';

export const NEIGHBORHOOD_NONE = '__none__';

interface NeighborhoodSelectProps {
  localityId: string | undefined;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NeighborhoodSelect({
  localityId,
  value,
  onChange,
  disabled,
}: NeighborhoodSelectProps) {
  const { data, isLoading } = useNeighborhoods(localityId);
  const isDisabled = disabled || !localityId || isLoading;

  const placeholder = !localityId
    ? 'Primero selecciona una localidad'
    : isLoading
      ? 'Cargando barrios…'
      : 'Selecciona un barrio (opcional)';

  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NEIGHBORHOOD_NONE}>Sin barrio específico</SelectItem>
        {data?.data.map((neighborhood) => (
          <SelectItem key={neighborhood.id} value={neighborhood.id}>
            {neighborhood.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
