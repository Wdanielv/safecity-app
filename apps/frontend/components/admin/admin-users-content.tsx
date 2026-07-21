'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/reports/pagination';
import { useAdminUsers } from '@/hooks/use-admin-users';
import { cn } from '@/lib/utils';
import { AdminUserRow } from './admin-user-row';

const PAGE_SIZE = 10;

export function AdminUsersContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <CardDescription>
          Gestiona el rol y el estado de las cuentas registradas en SAFECITY.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No se pudieron cargar los usuarios</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>Ocurrió un error al consultar la API. Intenta nuevamente.</span>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : !data || data.data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className={cn('overflow-x-auto transition-opacity', isFetching && 'opacity-60')}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Correo</th>
                  <th className="px-3 py-2 font-medium">Rol</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Registro</th>
                  <th className="px-3 py-2 font-medium">Reputación</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.data.map((user) => (
                  <AdminUserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination meta={data.meta} onPageChange={setPage} />}
      </CardContent>
    </Card>
  );
}
