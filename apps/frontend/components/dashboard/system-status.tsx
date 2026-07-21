'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useHealth } from '@/hooks/use-health';

const FRONTEND_VERSION = '0.1.0';

interface StatusItem {
  label: string;
  ok: boolean;
  value: string | undefined;
}

export function SystemStatus() {
  const { isAuthenticated } = useAuth();
  const { data: health, isLoading, isError } = useHealth();

  const backendConnected = Boolean(health) && !isError;

  const items: StatusItem[] = [
    {
      label: 'Backend conectado',
      ok: backendConnected,
      value: isLoading ? undefined : backendConnected ? 'Conectado' : 'Sin conexión',
    },
    {
      label: 'Usuario autenticado',
      ok: isAuthenticated,
      value: isAuthenticated ? 'Autenticado' : 'No autenticado',
    },
    {
      label: 'Estado de la API',
      ok: backendConnected,
      value: isLoading ? undefined : (health?.status ?? 'Desconocido'),
    },
    {
      label: 'Versión',
      ok: true,
      value: `SAFECITY v${FRONTEND_VERSION}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del sistema</CardTitle>
        <CardDescription>Salud de la conexión con la API de SAFECITY.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span className="text-sm font-medium">{item.label}</span>
            {item.value === undefined ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <Badge variant={item.ok ? 'default' : 'destructive'} className="gap-1">
                {item.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {item.value}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
