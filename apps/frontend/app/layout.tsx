import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegistration } from './service-worker-registration';

export const metadata: Metadata = {
  title: 'SAFECITY',
  description: 'Red Inteligente y Colaborativa de Seguridad Ciudadana',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1f4e5c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
