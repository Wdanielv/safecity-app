import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalitiesService } from './localities.service';
import { SearchLocalityDto } from './dto/search-locality.dto';
import { LocalityResponseDto } from './dto/locality-response.dto';

@ApiTags('Localities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('localities')
export class LocalitiesController {
  constructor(private readonly localitiesService: LocalitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar localidades',
    description:
      'Datos maestros de solo lectura, ordenados alfabéticamente por nombre.',
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de localidades' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Query() query: SearchLocalityDto) {
    return this.localitiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una localidad por id' })
  @ApiParam({ name: 'id', description: 'ID de la localidad' })
  @ApiResponse({
    status: 200,
    description: 'Localidad encontrada',
    type: LocalityResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.localitiesService.findOne(id);
  }
}
