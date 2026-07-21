import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'ID del tipo de incidente (IncidentType)',
    example: 'b3f1c2a0-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsUUID()
  incidentTypeId: string;

  @ApiProperty({
    description: 'ID de la localidad (Locality)',
    example: 'a1b2c3d4-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsUUID()
  localityId: string;

  @ApiPropertyOptional({
    description: 'ID del barrio (Neighborhood)',
    example: 'e5f6a7b8-1234-4a5b-9c6d-7e8f9a0b1c2d',
  })
  @IsOptional()
  @IsUUID()
  neighborhoodId?: string;

  @ApiProperty({
    description: 'Latitud del incidente',
    example: 4.710989,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitud del incidente',
    example: -74.072092,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({
    description: 'Descripción del incidente',
    example: 'Robo a mano armada frente al parque principal',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
