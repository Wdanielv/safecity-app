import { z } from 'zod';

function coordinateSchema(min: number, max: number, label: string) {
  return z
    .string()
    .min(1, `${label} es obligatoria`)
    .refine((value) => !Number.isNaN(Number(value)), {
      message: `Ingresa ${label.toLowerCase()} válida`,
    })
    .refine((value) => Number(value) >= min && Number(value) <= max, {
      message: `${label} debe estar entre ${min} y ${max}`,
    });
}

export const createReportSchema = z.object({
  incidentTypeId: z.string().min(1, 'Selecciona un tipo de incidente'),
  localityId: z.string().min(1, 'Selecciona una localidad'),
  neighborhoodId: z.string(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  latitude: coordinateSchema(-90, 90, 'La latitud'),
  longitude: coordinateSchema(-180, 180, 'La longitud'),
});

export type CreateReportFormValues = z.infer<typeof createReportSchema>;

export const updateReportSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'Máximo 500 caracteres'),
});

export type UpdateReportFormValues = z.infer<typeof updateReportSchema>;
