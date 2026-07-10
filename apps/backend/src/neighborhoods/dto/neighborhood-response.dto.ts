import { ApiProperty } from '@nestjs/swagger';

class NeighborhoodLocalityDto {
  @ApiProperty({ description: 'ID de la localidad' })
  id!: string;

  @ApiProperty({ description: 'Nombre de la localidad' })
  name!: string;
}

export class NeighborhoodResponseDto {
  @ApiProperty({ description: 'ID del barrio' })
  id!: string;

  @ApiProperty({ description: 'Nombre del barrio' })
  name!: string;

  @ApiProperty({
    description: 'Localidad a la que pertenece el barrio',
    type: NeighborhoodLocalityDto,
  })
  locality!: NeighborhoodLocalityDto;
}
