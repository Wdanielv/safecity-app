import type { LucideIcon } from 'lucide-react';
import {
  Ambulance,
  Car,
  Construction,
  Flame,
  HelpCircle,
  ShieldAlert,
  Swords,
  UserRoundSearch,
  Wallet,
} from 'lucide-react';

// El seed actual (apps/backend/prisma/seed.ts) no asigna `icon` ni `color`
// a los IncidentType — ambos quedan en null. Mapeamos el ícono por `code`
// (estable y único) en vez de depender de ese campo de texto libre, y
// exponemos un color/ícono por defecto para cuando la API no traiga uno.
const ICON_BY_CODE: Record<string, LucideIcon> = {
  ROBO: Wallet,
  HURTO: Wallet,
  ATRACO: ShieldAlert,
  PERSONA_SOSPECHOSA: UserRoundSearch,
  RINA: Swords,
  ACCIDENTE_TRANSITO: Car,
  INCENDIO: Flame,
  EMERGENCIA_MEDICA: Ambulance,
  DANO_VIAL: Construction,
  OTRO: HelpCircle,
};

export const DEFAULT_INCIDENT_ICON: LucideIcon = ShieldAlert;

export function getIncidentIcon(code: string): LucideIcon {
  return ICON_BY_CODE[code] ?? DEFAULT_INCIDENT_ICON;
}

// slate-500 — color neutro del design system, usado cuando IncidentType.color es null.
export const DEFAULT_INCIDENT_COLOR = '#64748b';

export function getIncidentColor(color: string | null | undefined): string {
  return color ?? DEFAULT_INCIDENT_COLOR;
}
