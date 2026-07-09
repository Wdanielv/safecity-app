import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

export class IncidentTypeSummaryDto {
  @ApiProperty({ example: 'b3f1c2a0-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id: string;

  @ApiProperty({ example: 'ROBO' })
  code: string;

  @ApiProperty({ example: 'Robo' })
  label: string;
}

export class LocalitySummaryDto {
  @ApiProperty({ example: 'a1b2c3d4-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id: string;

  @ApiProperty({ example: 'Chapinero' })
  name: string;
}

export class NeighborhoodSummaryDto {
  @ApiProperty({ example: 'e5f6a7b8-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id: string;

  @ApiProperty({ example: 'El Refugio' })
  name: string;
}

export class ReportOwnerSummaryDto {
  @ApiProperty({ example: 'f1a2b3c4-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiPropertyOptional({ example: 'https://cdn.safecity.com/avatars/u1.png' })
  photoUrl: string | null;
}

export class ReportResponseDto {
  @ApiProperty({ example: 'c1d2e3f4-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id: string;

  @ApiPropertyOptional({
    example: 'Robo a mano armada frente al parque principal',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 4.710989 })
  latitude: number;

  @ApiProperty({ example: -74.072092 })
  longitude: number;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.PENDIENTE })
  status: ReportStatus;

  @ApiProperty({ example: true })
  visibleOnMap: boolean;

  @ApiProperty({ example: '2026-07-10T12:00:00.000Z' })
  expiresAt: Date;

  @ApiProperty({ example: '2026-07-09T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-09T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: IncidentTypeSummaryDto })
  incidentType: IncidentTypeSummaryDto;

  @ApiProperty({ type: LocalitySummaryDto })
  locality: LocalitySummaryDto;

  @ApiPropertyOptional({ type: NeighborhoodSummaryDto, nullable: true })
  neighborhood: NeighborhoodSummaryDto | null;

  @ApiPropertyOptional({ type: ReportOwnerSummaryDto, nullable: true })
  user: ReportOwnerSummaryDto | null;
}