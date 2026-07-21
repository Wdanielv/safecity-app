'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Calendar, CheckCircle2, Loader2, Mail, ShieldCheck, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useChangePassword } from '@/hooks/use-change-password';
import { useReputation } from '@/hooks/use-reputation';
import { useUpdateProfile } from '@/hooks/use-update-profile';
import { getApiErrorMessage } from '@/lib/api/error';
import { formatDate, getInitials } from '@/lib/format';
import { ROLE_LABELS } from '@/lib/roles';
import {
  passwordSchema,
  profileSchema,
  type PasswordFormValues,
  type ProfileFormValues,
} from '@/lib/validations/profile';

export function ProfileContent() {
  const { user, isAuthenticated } = useAuth();
  const { data: reputation, isLoading, isError } = useReputation(isAuthenticated);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar size="lg" className="h-20 w-20">
            {user.photoUrl && <AvatarImage src={user.photoUrl} alt={user.name} />}
            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Correo</p>
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="text-sm font-medium">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
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

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha de registro</p>
              <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileCard />
      <ChangePasswordCard />
    </div>
  );
}

function EditProfileCard() {
  const { user, updateUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      photoUrl: user?.photoUrl ?? '',
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const timeout = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  if (!user) {
    return null;
  }

  async function onSubmit(values: ProfileFormValues) {
    setSubmitError(null);
    setShowSuccess(false);
    try {
      const updated = await updateProfile.mutateAsync({
        name: values.name,
        phone: values.phone || undefined,
        photoUrl: values.photoUrl || undefined,
      });
      updateUser(updated);
      form.reset({
        name: updated.name,
        phone: updated.phone ?? '',
        photoUrl: updated.photoUrl ?? '',
      });
      setShowSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo actualizar el perfil.'));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar perfil</CardTitle>
        <CardDescription>Actualiza tu nombre, teléfono y foto de perfil.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo actualizar el perfil</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {showSuccess && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Perfil actualizado</AlertTitle>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+57 300 123 4567"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la foto de perfil</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://cdn.safecity.com/avatars/tu-foto.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Guardar cambios
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const changePassword = useChangePassword();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const timeout = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  async function onSubmit(values: PasswordFormValues) {
    setSubmitError(null);
    setShowSuccess(false);
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.reset();
      setShowSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'No se pudo cambiar la contraseña.'));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>Tu nueva contraseña debe ser diferente a la actual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cambiar la contraseña</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {showSuccess && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Contraseña actualizada correctamente</AlertTitle>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Actualizar contraseña
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
