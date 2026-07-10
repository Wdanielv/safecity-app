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
import { NeighborhoodsService } from './neighborhoods.service';
import { SearchNeighborhoodDto } from './dto/search-neighborhood.dto';
import { NeighborhoodResponseDto } from './dto/neighborhood-response.dto';

@ApiTags('Neighborhoods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener listado paginado de barrios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de barrios obtenido correctamente',
  })
  
  findAll(@Query() query: SearchNeighborhoodDto) {
    return this.neighborhoodsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un barrio por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del barrio',
  })
  @ApiResponse({
    status: 200,
    description: 'Barrio encontrado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Barrio no encontrado',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NeighborhoodResponseDto> {
    return this.neighborhoodsService.findOne(id);
  }
}
