import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

// No estaba listado explícitamente en la sección "DTOs" del enunciado,
// pero el endpoint PATCH /incident-types/:id/status necesita un body
// validado, así que se agrega este DTO dedicado en vez de reutilizar
// UpdateIncidentTypeDto (que tiene un propósito distinto).
export class ChangeIncidentTypeStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del tipo de incidente',
    example: false,
  })
  @IsBoolean()
  active: boolean;
}
