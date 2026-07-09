import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class SearchReportDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de incidente',
    example: 'b3f1c2a0-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsOptional()
  @IsUUID()
  incidentTypeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por localidad',
    example: 'a1b2c3d4-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsOptional()
  @IsUUID()
  localityId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por barrio',
    example: 'e5f6a7b8-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsOptional()
  @IsUUID()
  neighborhoodId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado del reporte',
    enum: ReportStatus,
    example: ReportStatus.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ description: 'Número de página', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Resultados por página', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}