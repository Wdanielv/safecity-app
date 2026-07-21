'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocalities } from '@/hooks/use-localities';

export const LOCALITY_ALL = '__all__';

interface LocalitySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  allowAll?: boolean;
  allLabel?: string;
}

export function LocalitySelect({
  value,
  onChange,
  disabled,
  allowAll,
  allLabel = 'Todas las localidades',
}: LocalitySelectProps) {
  const { data, isLoading, isError } = useLocalities();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || isLoading || isError}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading
              ? 'Cargando localidades…'
              : isError
                ? 'No se pudieron cargar las localidades'
                : 'Selecciona una localidad'
          }
        />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value={LOCALITY_ALL}>{allLabel}</SelectItem>}
        {data?.data.map((locality) => (
          <SelectItem key={locality.id} value={locality.id}>
            {locality.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
