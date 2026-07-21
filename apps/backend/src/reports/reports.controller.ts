import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
import { ReportsService, PaginatedResult } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SearchReportDto } from './dto/search-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';

interface AuthenticatedUser {
  sub: string;
  email: string;
  role: UserRole;
}

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un reporte',
    description:
      'status, visibleOnMap, expiresAt y userId se calculan automáticamente en el backend.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reporte creado',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tipo de incidente inactivo',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidente, localidad o barrio no encontrado',
  })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateReportDto) {
    return this.reportsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar reportes con filtros y paginación',
    description:
      'Soporta filtros opcionales por tipo de incidente, localidad, barrio, ' +
      'estado y autor (userId, usado por el caso de uso "Mis Reportes").',
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de reportes' })
  findAll(
    @Query() query: SearchReportDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedResult<ReportResponseDto>> {
    return this.reportsService.findAll(query, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un reporte' })
  @ApiParam({ name: 'id', description: 'ID del reporte' })
  @ApiResponse({
    status: 200,
    description: 'Reporte encontrado',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reportsService.findOne(id, user.sub);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar la descripción de un reporte',
    description:
      'Solo el propietario puede editar, y solo mientras el reporte esté en estado PENDIENTE.',
  })
  @ApiParam({ name: 'id', description: 'ID del reporte' })
  @ApiResponse({
    status: 200,
    description: 'Reporte actualizado',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'El reporte ya no está en estado PENDIENTE',
  })
  @ApiResponse({
    status: 403,
    description: 'No eres el propietario del reporte',
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar (ocultar) un reporte',
    description:
      'Soft delete: coloca visibleOnMap = false. Permitido para el propietario o para ADMINISTRADOR/MODERADOR.',
  })
  @ApiParam({ name: 'id', description: 'ID del reporte' })
  @ApiResponse({ status: 200, description: 'Reporte ocultado del mapa' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para eliminar este reporte',
  })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reportsService.remove(id, user.sub, user.role);
  }
}
