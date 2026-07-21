import { ApiProperty } from '@nestjs/swagger';

export class ConfirmationResponseDto {
  @ApiProperty({
    description: 'ID del reporte confirmado',
    example: '2d7e9f35-6c0b-4b30-a6f7-0f35d3d1d6a1',
  })
  reportId!: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la confirmación',
    example: '7b4e9f35-9c2b-4e20-a6f7-3c85d3d1d111',
  })
  confirmedBy!: string;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó la confirmación',
    example: '2026-07-09T19:45:23.000Z',
  })
  confirmedAt!: Date;
}
