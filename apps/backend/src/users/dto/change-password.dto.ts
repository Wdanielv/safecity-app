import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'MiPasswordActual123',
  })
  @IsString()
  @IsNotEmpty({ message: 'currentPassword es obligatorio' })
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña. Debe ser diferente a la actual.',
    example: 'MiPasswordNueva456',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'newPassword debe tener al menos 8 caracteres' })
  newPassword: string;
}
