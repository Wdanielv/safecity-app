import { ApiProperty } from '@nestjs/swagger';

export class LocalityResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-1234-4a5b-9c6d-7e8f9a0b1c2d' })
  id!: string;

  @ApiProperty({ example: 'Chapinero' })
  name!: string;

  @ApiProperty({ example: '2026-07-09T12:00:00.000Z' })
  createdAt!: Date;
}
