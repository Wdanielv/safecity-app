import { ApiProperty } from '@nestjs/swagger';

export class ReputationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  reputation!: number;
}