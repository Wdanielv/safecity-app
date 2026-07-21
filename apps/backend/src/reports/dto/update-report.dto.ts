import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateReportDto {
  @ApiProperty({
    description: 'Nueva descripción del reporte. Es el único campo editable.',
    example: 'Actualizo: el incidente ya fue controlado por la policía',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'description es obligatorio' })
  @MaxLength(500)
  description: string;
}
