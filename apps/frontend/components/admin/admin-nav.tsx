'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminNavItem {
  label: string;
  href: string;
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Usuarios', href: '/admin' },
  { label: 'Reportes', href: '/admin/reports' },
  { label: 'Tipos de incidente', href: '/admin/incident-types' },
  { label: 'Localidades', href: '/admin/localities' },
  { label: 'Barrios', href: '/admin/neighborhoods' },
  { label: 'Estadísticas', href: '/admin/stats' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2">
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground',
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
