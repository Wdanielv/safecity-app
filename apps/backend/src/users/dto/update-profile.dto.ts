import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de contacto',
    example: '+57 300 123 4567',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: 'phone debe ser un número de teléfono válido',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://cdn.safecity.com/avatars/user123.png',
  })
  @IsOptional()
  @IsUrl({}, { message: 'photoUrl debe ser una URL válida' })
  photoUrl?: string;
}
