import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/auth-layout';
import { GuestRoute } from '@/components/auth/guest-route';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Iniciar sesión | SAFECITY',
};

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </GuestRoute>
  );
}
