import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { QuickAction } from './quick-actions';

export function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <Card className="relative flex flex-col justify-between">
      {!action.available && (
        <Badge variant="secondary" className="absolute top-4 right-4">
          Próximamente
        </Badge>
      )}
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{action.title}</CardTitle>
        <CardDescription>{action.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild={action.available}
          disabled={!action.available}
          variant={action.available ? 'default' : 'secondary'}
          className="w-full"
        >
          {action.available ? <Link href={action.href}>{action.cta}</Link> : <span>{action.cta}</span>}
        </Button>
      </CardContent>
    </Card>
  );
}
