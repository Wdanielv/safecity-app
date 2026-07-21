import { Construction } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminSectionPlaceholderProps {
  title: string;
  description: string;
}

export function AdminSectionPlaceholder({ title, description }: AdminSectionPlaceholderProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Construction className="h-10 w-10 text-muted-foreground" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        Esta sección estará disponible próximamente.
      </CardContent>
    </Card>
  );
}
