import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class SearchNeighborhoodDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'ID de la localidad para filtrar los barrios pertenecientes a ella',
  })
  @IsOptional()
  @IsUUID()
  localityId?: string;
}
