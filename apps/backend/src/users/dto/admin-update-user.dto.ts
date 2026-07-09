import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class AdminUpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nuevo rol del usuario',
    enum: UserRole,
    example: UserRole.ADMINISTRADOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role debe ser un valor válido de UserRole' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Nuevo estado del usuario',
    enum: UserStatus,
    example: UserStatus.ACTIVO,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'status debe ser un valor válido de UserStatus' })
  status?: UserStatus;
}