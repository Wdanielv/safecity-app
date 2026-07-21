import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, type TransformFnParams } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class SearchIncidentTypeDto {
  @ApiPropertyOptional({
    description:
      'Filtrar por estado. Si no se envía, los usuarios normales solo ' +
      'ven los tipos activos; un administrador puede enviar active=false ' +
      'para revisar los tipos desactivados.',
    example: true,
  })
  @IsOptional()
  // Los query params llegan como string ("true"/"false"), se transforman
  // a boolean real antes de validar.
  @Transform(({ value }: TransformFnParams): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean | undefined;
  })
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Resultados por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
