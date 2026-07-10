import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
// NOTA: se asume que estos dos archivos ya existen porque el enunciado
// indica "puedes reutilizar el mismo mecanismo de autorización por roles
// que ya usas en el módulo Users". Si en tu proyecto los nombres o rutas
// son distintos, solo hay que ajustar estos dos imports.
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IncidentTypesService } from './incident-types.service';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';
import { SearchIncidentTypeDto } from './dto/search-incident-type.dto';
import { ChangeIncidentTypeStatusDto } from './dto/change-incident-type-status.dto';

@ApiTags('Incident Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incident-types')

export class IncidentTypesController {
  constructor(private readonly incidentTypesService: IncidentTypesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Crear un tipo de incidente',
    description: 'Solo ADMINISTRADOR. El código (code) debe ser único.',
  })
  @ApiResponse({ status: 201, description: 'Tipo de incidente creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (no es ADMINISTRADOR)' })
  @ApiResponse({ status: 409, description: 'Ya existe un tipo con ese código' })
  create(@Body() dto: CreateIncidentTypeDto) {
    return this.incidentTypesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar tipos de incidente',
    description:
      'Accesible para cualquier usuario autenticado. Por defecto solo ' +
      'devuelve tipos activos; se puede filtrar explícitamente con ?active=.',
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de tipos de incidente' })
  findAll(@Query() query: SearchIncidentTypeDto) {
    return this.incidentTypesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un tipo de incidente' })
  @ApiParam({ name: 'id', description: 'ID del tipo de incidente' })
  @ApiResponse({ status: 200, description: 'Tipo de incidente encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de incidente no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidentTypesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Actualizar un tipo de incidente',
    description:
      'Solo ADMINISTRADOR. El campo code no es editable y se ignora si se envía.',
  })
  @ApiParam({ name: 'id', description: 'ID del tipo de incidente' })
  @ApiResponse({ status: 200, description: 'Tipo de incidente actualizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (no es ADMINISTRADOR)' })
  @ApiResponse({ status: 404, description: 'Tipo de incidente no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentTypeDto,
  ) {
    return this.incidentTypesService.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Activar o desactivar un tipo de incidente',
    description:
      'Solo ADMINISTRADOR. No elimina el registro; un tipo desactivado ' +
      'no puede usarse para crear nuevos reportes, pero los reportes ' +
      'existentes que lo referencian no se ven afectados: ' +
      'repetir la misma petición no genera error.',
  })
  @ApiParam({ name: 'id', description: 'ID del tipo de incidente' })
  @ApiResponse({ status: 200, description: 'Estado actualizado (o ya se encontraba en ese estado)' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (no es ADMINISTRADOR)' })
  @ApiResponse({ status: 404, description: 'Tipo de incidente no encontrado' })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeIncidentTypeStatusDto,
  ) {
    return this.incidentTypesService.changeStatus(id, dto);
  }
}
