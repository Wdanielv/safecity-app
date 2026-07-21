'use client';

import { Award, Calendar, Mail, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useReputation } from '@/hooks/use-reputation';
import { formatDate } from '@/lib/format';
import { ROLE_LABELS } from '@/lib/roles';

export function UserSummary() {
  const { user, isAuthenticated } = useAuth();
  const { data: reputation, isLoading, isError } = useReputation(isAuthenticated);

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Hola, {user.name.split(' ')[0]}</CardTitle>
        <CardDescription>Este es el resumen de tu cuenta en SAFECITY.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Rol</p>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Correo</p>
            <p className="truncate text-sm font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Award className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Reputación</p>
            {isLoading ? (
              <Skeleton className="h-5 w-12" />
            ) : isError ? (
              <p className="text-sm text-muted-foreground">No disponible</p>
            ) : (
              <p className="text-sm font-medium">{reputation?.reputation} pts</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Miembro desde</p>
            <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
