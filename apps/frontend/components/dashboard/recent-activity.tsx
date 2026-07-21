import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// ---------------------------------------------------------------------
// MOCK — actividad simulada. Reemplazar por datos reales cuando exista
// un endpoint de actividad/timeline en el backend. Aislado a propósito
// en este archivo para que el reemplazo futuro no toque el resto del
// Dashboard.
// ---------------------------------------------------------------------
const MOCK_ACTIVITY = [
  { id: '1', label: 'Reportaste un incidente en Chapinero', timestamp: 'Hace 2 horas' },
  { id: '2', label: 'Tu reporte fue confirmado por 3 vecinos', timestamp: 'Hace 5 horas' },
  { id: '3', label: 'Te uniste a SAFECITY', timestamp: 'Hace 3 días' },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Actividad reciente</CardTitle>
          <Badge variant="secondary">Datos de ejemplo</Badge>
        </div>
        <CardDescription>Esta sección aún no está conectada a datos reales.</CardDescription>
      </CardHeader>
      <CardContent>
        {MOCK_ACTIVITY.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay actividad reciente.</p>
        ) : (
          <ul className="space-y-3">
            {MOCK_ACTIVITY.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span>{item.label}</span>
                <span className="shrink-0 text-muted-foreground">{item.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
