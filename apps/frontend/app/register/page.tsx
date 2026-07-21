import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestRoute } from '@/components/auth/guest-route';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Crear cuenta | SAFECITY',
};

export default function RegisterPage() {
  return (
    <GuestRoute>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </GuestRoute>
  );
}
