import { Card, CardContent } from '@/components/ui/card';
import { ReportForm } from './report-form';

export function CreateReportContent() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crear reporte</h1>
        <p className="text-sm text-muted-foreground">
          Reporta un incidente de seguridad para que tu comunidad lo conozca.
        </p>
      </div>
      <Card>
        <CardContent>
          <ReportForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
