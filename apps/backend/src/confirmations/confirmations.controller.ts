import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfirmationsService } from './confirmations.service';
import { ConfirmationResponseDto } from './dto/confirmation-response.dto';

interface AuthenticatedUser {
  sub: string;
  email: string;
  role: UserRole;
}

@ApiTags('Confirmations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports/:id/confirmations')
export class ConfirmationsController {
  constructor(
    private readonly confirmationsService: ConfirmationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Confirmar un reporte',
    description:
      'Permite que un ciudadano confirme un reporte realizado por otro usuario.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
  })
  @ApiResponse({
    status: 201,
    description: 'Reporte confirmado correctamente',
    type: ConfirmationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes confirmar tu propio reporte',
  })
  @ApiResponse({
    status: 404,
    description: 'Reporte no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya habías confirmado este reporte',
  })
  create(
    @Param('id', ParseUUIDPipe) reportId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.confirmationsService.create(reportId, user.sub);
  }

  @Delete()
  @ApiOperation({
    summary: 'Eliminar una confirmación',
    description:
      'Permite retirar la confirmación realizada previamente sobre un reporte.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmación eliminada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Reporte o confirmación no encontrados',
  })
  remove(
    @Param('id', ParseUUIDPipe) reportId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.confirmationsService.remove(reportId, user.sub);
  }
}