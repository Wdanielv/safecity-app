'use client';

import { Search, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REPORT_STATUS_LABELS } from '@/lib/report-status';
import type { ReportStatus } from '@safecity/shared-types';
import { IncidentTypeSelect } from './incident-type-select';
import { LocalitySelect } from './locality-select';

export const STATUS_ALL = '__all__';
export const SORT_NEWEST = 'newest';
export const SORT_OLDEST = 'oldest';
export const SORT_STATUS = 'status';

export interface ReportFiltersValue {
  search: string;
  incidentTypeId: string;
  localityId: string;
  status: string;
  sort: string;
  onlyMine: boolean;
}

interface ReportFiltersProps {
  value: ReportFiltersValue;
  onChange: (value: ReportFiltersValue) => void;
}

export function ReportFilters({ value, onChange }: ReportFiltersProps) {
  function set<K extends keyof ReportFiltersValue>(key: K, next: ReportFiltersValue[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.search}
          onChange={(event) => set('search', event.target.value)}
          placeholder="Buscar en esta página…"
          className="pl-8"
        />
      </div>

      <div className="w-full sm:w-48">
        <IncidentTypeSelect
          value={value.incidentTypeId}
          onChange={(next) => set('incidentTypeId', next)}
          allowAll
        />
      </div>

      <div className="w-full sm:w-48">
        <LocalitySelect
          value={value.localityId}
          onChange={(next) => set('localityId', next)}
          allowAll
        />
      </div>

      <div className="w-full sm:w-40">
        <Select value={value.status} onValueChange={(next) => set('status', next)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_ALL}>Todos los estados</SelectItem>
            {(Object.keys(REPORT_STATUS_LABELS) as ReportStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {REPORT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-44">
        <Select value={value.sort} onValueChange={(next) => set('sort', next)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_NEWEST}>Más recientes</SelectItem>
            <SelectItem value={SORT_OLDEST}>Más antiguos</SelectItem>
            <SelectItem value={SORT_STATUS}>Estado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant={value.onlyMine ? 'default' : 'outline'}
        onClick={() => set('onlyMine', !value.onlyMine)}
        className="w-full sm:w-auto"
      >
        <UserRound className="h-4 w-4" />
        Solo mis reportes
      </Button>
    </div>
  );
}
