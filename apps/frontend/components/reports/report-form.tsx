'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReport } from '@/hooks/use-create-report';
import { useGeocodeAddress } from '@/hooks/use-geocode-address';
import { useUpdateReport } from '@/hooks/use-update-report';
import { getApiErrorMessage } from '@/lib/api/error';
import { formatDate } from '@/lib/format';
import {
  createReportSchema,
  updateReportSchema,
  type CreateReportFormValues,
  type UpdateReportFormValues,
} from '@/lib/validations/report';
import type { Report } from '@/types/api';
import { IncidentTypeSelect } from './incident-type-select';
import { LocalitySelect } from './locality-select';
import { NEIGHBORHOOD_NONE, NeighborhoodSelect } from './neighborhood-select';
import { ReportBadge } from './report-badge';
import { ReportStatus } from './report-status';

const LocationMap = dynamic(
  () => import('./location-map').then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full animate-pulse rounded-lg border bg-muted" />
    ),
  },
);

interface ReportFormProps {
  mode: 'create' | 'edit';
  report?: Report;
}

export function ReportForm({ mode, report }: ReportFormProps) {
  if (mode === 'edit' && report) {
    return <EditReportForm report={report} />;
  }
  return <CreateReportForm />;
}

function CreateReportForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const createReport = useCreateReport();
  const geocodeAddress = useGeocodeAddress();

  const form = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      incidentTypeId: '',
      localityId: '',
      neighborhoodId: NEIGHBORHOOD_NONE,
      description: '',
      latitude: '',
      longitude: '',
    },
  });

  const localityId = form.watch('localityId');
  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');

  useEffect(() => {
    form.setValue('neighborhoodId', NEIGHBORHOOD_NONE);
    // Solo debe resetear el barrio cuando cambia la localidad, no en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localityId]);

  function setCoordinates(lat: number, lng: number) {
    form.setValue('latitude', String(lat), { shouldValidate: true });
    form.setValue('longitude', String(lng), { shouldValidate: true });
  }

  async function handleSearchLocation() {
    setGeocodeError(null);
    if (!address.trim()) {
      setGeocodeError('Ingresa una dirección para buscar.');
      return;
    }
    try {
      const result = await geocodeAddress.mutateAsync(address);
      if (!result) {
        setGeocodeError('No se encontró la dirección. Intenta con otra o ajusta el marcador en el mapa.');
        return;
      }
      setCoordinates(result.latitude, result.longitude);
    } catch (error) {
      setGeocodeError(getApiErrorMessage(error, 'No se pudo buscar la dirección.'));
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CreateReportFormValues) {
    setSubmitError(null);
    try {
      const created = await createReport.mutateAsync({
        incidentTypeId: values.incidentTypeId,
        localityId: values.localityId,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        ...(values.neighborhoodId !== NEIGHBORHOOD_NONE && {
          neighborhoodId: values.neighborhoodId,
        }),
        ...(values.description && { description: values.description }),
      });
      router.push(`/reports/${created.id}`);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo crear el reporte.'));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo crear el reporte</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="incidentTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de incidente</FormLabel>
              <FormControl>
                <IncidentTypeSelect value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                El color y el ícono se toman automáticamente del tipo elegido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe brevemente lo ocurrido (opcional)" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="localityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <LocalitySelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neighborhoodId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barrio</FormLabel>
                <FormControl>
                  <NeighborhoodSelect
                    localityId={localityId}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label>Ubicación</Label>
            <p className="text-sm text-muted-foreground">
              Busca la dirección del incidente o ajusta el marcador directamente en el mapa.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Ej. Calle 26 #13-19, Bogotá"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearchLocation();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleSearchLocation}
              disabled={geocodeAddress.isPending}
              className="shrink-0"
            >
              {geocodeAddress.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              Buscar ubicación
            </Button>
          </div>

          {geocodeError && <p className="text-sm text-destructive">{geocodeError}</p>}

          <LocationMap
            latitude={latitude ? Number(latitude) : null}
            longitude={longitude ? Number(longitude) : null}
            onChange={setCoordinates}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitud</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder="Se completa al buscar o mover el marcador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder="Se completa al buscar o mover el marcador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Crear reporte
        </Button>
      </form>
    </Form>
  );
}

function EditReportForm({ report }: { report: Report }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateReport = useUpdateReport(report.id);

  const form = useForm<UpdateReportFormValues>({
    resolver: zodResolver(updateReportSchema),
    defaultValues: { description: report.description ?? '' },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: UpdateReportFormValues) {
    setSubmitError(null);
    try {
      await updateReport.mutateAsync(values);
      router.push(`/reports/${report.id}`);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo actualizar el reporte.'));
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Estos datos no se pueden editar: la API solo permite actualizar la descripción.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <ReportBadge incidentType={report.incidentType} />
          <ReportStatus status={report.status} />
        </div>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Localidad</dt>
            <dd>{report.locality.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Barrio</dt>
            <dd>{report.neighborhood?.name ?? 'No especificado'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Coordenadas</dt>
            <dd>
              {report.latitude}, {report.longitude}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Creado</dt>
            <dd>{formatDate(report.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>No se pudo actualizar el reporte</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </Form>
    </div>
  );
}
