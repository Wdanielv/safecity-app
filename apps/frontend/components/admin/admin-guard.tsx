'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role !== 'ADMINISTRADOR') {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="items-center text-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
            <CardTitle>Acceso denegado</CardTitle>
            <CardDescription>
              No tienes permisos para ver esta sección. Se requiere rol de administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard">Volver al dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
