import type { LucideIcon } from 'lucide-react';
import { FileWarning, LayoutDashboard, Shield, UserRound } from 'lucide-react';
import { UserRole } from '@safecity/shared-types';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

// Solo se listan las secciones que ya existen. Mapa se agrega aquí cuando
// su ruta quede implementada.
export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Reportes', href: '/reports', icon: FileWarning },
  { label: 'Perfil', href: '/profile', icon: UserRound },
  { label: 'Administración', href: '/admin', icon: Shield, roles: [UserRole.ADMINISTRADOR] },
];
