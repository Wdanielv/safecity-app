import type { LucideIcon } from 'lucide-react';
import { FilePlus, ListChecks, Map, Star, UserRound } from 'lucide-react';

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  available: boolean;
  cta: string;
}

// Cada tarjeta ya queda enlazada a su ruta futura; "available" controla si
// se puede navegar hoy o si todavía está pendiente de una fase posterior.
export const quickActions: QuickAction[] = [
  {
    title: 'Mi Perfil',
    description: 'Consulta tu información personal y tu actividad en SAFECITY.',
    href: '/profile',
    icon: UserRound,
    available: true,
    cta: 'Ver perfil',
  },
  {
    title: 'Crear Reporte',
    description: 'Reporta un incidente de seguridad en tu zona.',
    href: '/reports/new',
    icon: FilePlus,
    available: true,
    cta: 'Crear reporte',
  },
  {
    title: 'Mis Reportes',
    description: 'Revisa el estado de los reportes que has creado.',
    href: '/reports/mine',
    icon: ListChecks,
    available: true,
    cta: 'Ver reportes',
  },
  {
    title: 'Mapa de Reportes',
    description: 'Explora los incidentes reportados cerca de ti.',
    href: '/map',
    icon: Map,
    available: false,
    cta: 'Abrir mapa',
  },
  {
    title: 'Reputación',
    description: 'Consulta tu puntaje de reputación en la comunidad.',
    href: '/profile',
    icon: Star,
    available: true,
    cta: 'Ver reputación',
  },
];
