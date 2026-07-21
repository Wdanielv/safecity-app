'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useConfirmReport } from '@/hooks/use-confirm-report';
import { useDeleteReport } from '@/hooks/use-delete-report';
import { useReport } from '@/hooks/use-report';
import { useUnconfirmReport } from '@/hooks/use-unconfirm-report';
import { useUserReputation } from '@/hooks/use-user-reputation';
import { getApiErrorMessage } from '@/lib/api/error';
import { formatDate, getInitials } from '@/lib/format';
import { ReportBadge } from './report-badge';
import { ReportStatus } from './report-status';

const MODERATOR_ROLES = ['ADMINISTRADOR', 'MODERADOR'];

export function ReportDetailContent({ reportId }: { reportId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: report, isLoading, isError, refetch } = useReport(reportId);
  const deleteReport = useDeleteReport();
  const confirmReport = useConfirmReport(reportId);
  const unconfirmReport = useUnconfirmReport(reportId);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const authorId = report?.user?.id;
  const { data: authorReputation, isLoading: isReputationLoading } = useUserReputation(authorId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar el reporte</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>Puede que el reporte no exista o que haya un problema de conexión.</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const isOwner = user?.id === report.user?.id;
  const isModerator = user ? MODERATOR_ROLES.includes(user.role) : false;
  const canEdit = isOwner && report.status === 'PENDIENTE';
  const canDelete = (isOwner || isModerator) && report.visibleOnMap;

  async function handleDelete() {
    setDeleteError(null);
    try {
      await deleteReport.mutateAsync(reportId);
      setDialogOpen(false);
      router.push('/reports');
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, 'No se pudo eliminar el reporte.'));
    }
  }

  async function handleToggleConfirmation() {
    setConfirmError(null);
    try {
      if (report?.confirmedByMe) {
        await unconfirmReport.mutateAsync();
      } else {
        await confirmReport.mutateAsync();
      }
    } catch (error) {
      setConfirmError(getApiErrorMessage(error, 'No se pudo actualizar la confirmación.'));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/reports">
          <ArrowLeft className="h-4 w-4" />
          Volver a reportes
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ReportBadge incidentType={report.incidentType} />
            <ReportStatus status={report.status} />
          </div>
          <p className="text-base leading-relaxed">
            {report.description || 'El autor no proporcionó una descripción.'}
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Localidad y barrio</p>
                <p className="text-sm font-medium">
                  {report.locality.name}
                  {report.neighborhood ? ` · ${report.neighborhood.name}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm font-medium">
                  {formatDate(report.createdAt, {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Autor</p>
                {report.user ? (
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      {report.user.photoUrl && (
                        <AvatarImage src={report.user.photoUrl} alt={report.user.name} />
                      )}
                      <AvatarFallback>{getInitials(report.user.name)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{report.user.name}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium">Usuario eliminado</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Reputación del autor</p>
                {!report.user ? (
                  <p className="text-sm text-muted-foreground">No disponible</p>
                ) : isReputationLoading ? (
                  <Skeleton className="h-5 w-12" />
                ) : authorReputation ? (
                  <p className="text-sm font-medium">{authorReputation.reputation} pts</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No disponible</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
            <Badge variant="outline">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {report.confirmationCount}{' '}
              {report.confirmationCount === 1 ? 'confirmación' : 'confirmaciones'}
            </Badge>
            {!isOwner && (
              <Button
                type="button"
                variant={report.confirmedByMe ? 'outline' : 'default'}
                size="sm"
                onClick={() => void handleToggleConfirmation()}
                disabled={confirmReport.isPending || unconfirmReport.isPending}
              >
                {(confirmReport.isPending || unconfirmReport.isPending) && (
                  <Loader2 className="animate-spin" />
                )}
                {report.confirmedByMe ? 'Quitar confirmación' : 'Confirmar reporte'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {confirmError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo actualizar la confirmación</AlertTitle>
          <AlertDescription>{confirmError}</AlertDescription>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo eliminar el reporte</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {(canEdit || canDelete) && (
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button asChild variant="outline">
              <Link href={`/reports/${reportId}/edit`}>
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}

          {canDelete && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Eliminar este reporte?</DialogTitle>
                  <DialogDescription>
                    Esta acción oculta el reporte del mapa y del listado. No se puede deshacer desde
                    la aplicación.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => void handleDelete()}
                    disabled={deleteReport.isPending}
                  >
                    {deleteReport.isPending && <Loader2 className="animate-spin" />}
                    Eliminar reporte
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
