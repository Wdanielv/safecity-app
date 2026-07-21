import { z } from 'zod';

const phoneField = z
  .string()
  .regex(/^[0-9+\-\s()]{7,20}$/, 'Ingresa un número de teléfono válido')
  .or(z.literal(''));

const urlField = z
  .string()
  .url('Ingresa una URL válida')
  .or(z.literal(''));

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  phone: phoneField,
  photoUrl: urlField,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(50, 'La nueva contraseña no puede superar 50 caracteres'),
    confirmNewPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
