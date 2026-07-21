import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateIncidentTypeDto {
  @ApiProperty({
    description:
      'Código único del tipo de incidente. No debería cambiar una vez creado.',
    example: 'ROBO',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: 'code es obligatorio' })
  @MaxLength(30)
  // Se normaliza en mayúsculas para evitar duplicados como "Robo" / "robo".
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'code solo puede contener mayúsculas, números y guion bajo',
  })
  code: string;

  @ApiProperty({
    description: 'Nombre visible del tipo de incidente',
    example: 'Robo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'label es obligatorio' })
  @MaxLength(100)
  label: string;

  @ApiPropertyOptional({
    description: 'Identificador/nombre del ícono a usar en el frontend',
    example: 'robbery',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiPropertyOptional({
    description: 'Color asociado al tipo de incidente (hexadecimal)',
    example: '#FF0000',
  })
  @IsOptional()
  @IsHexColor({ message: 'color debe ser un valor hexadecimal válido' })
  color?: string;

  @ApiProperty({
    description:
      'Horas de validez por defecto de un reporte de este tipo antes de expirar',
    example: 24,
    minimum: 1,
  })
  @IsInt()
  @Min(1, { message: 'defaultValidityHours debe ser mayor a 0' })
  @Max(8760, { message: 'defaultValidityHours no puede superar un año' })
  defaultValidityHours: number;
}
