import { HealthStatus } from './health-status';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">SAFECITY</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Red Inteligente y Colaborativa de Seguridad Ciudadana
        </p>
      </div>
      <HealthStatus />
    </main>
  );
}
