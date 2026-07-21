import Link from 'next/link';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import type { Report } from '@/types/api';
import { ReportBadge } from './report-badge';
import { ReportStatus } from './report-status';

export function ReportCard({ report }: { report: Report }) {
  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <ReportBadge incidentType={report.incidentType} />
          <ReportStatus status={report.status} />
        </div>
        <CardDescription className="line-clamp-2">
          {report.description || 'Sin descripción proporcionada.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {report.locality.name}
            {report.neighborhood ? ` · ${report.neighborhood.name}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 shrink-0" />
          <span>
            {formatDate(report.createdAt, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            {report.confirmationCount}{' '}
            {report.confirmationCount === 1 ? 'confirmación' : 'confirmaciones'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/reports/${report.id}`}>Ver detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
