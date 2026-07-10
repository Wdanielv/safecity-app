import { Injectable, NotFoundException } from '@nestjs/common';
import { Locality } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchLocalityDto } from './dto/search-locality.dto';
import { LocalityResponseDto } from './dto/locality-response.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class LocalitiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /localities
   * Lista localidades paginadas, ordenadas alfabéticamente por nombre.
   * Las localidades son datos maestros: no se crean, actualizan ni
   * eliminan desde la aplicación, solo se consultan.
   */
  async findAll(
    query: SearchLocalityDto,
  ): Promise<PaginatedResult<LocalityResponseDto>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 && query.limit <= 100
      ? query.limit
      : 10;
    const skip = (page - 1) * limit;

    const [localities, total] = await this.prisma.$transaction([
      this.prisma.locality.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.locality.count(),
    ]);

    return {
      data: localities.map((locality) => this.toResponseDto(locality)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * GET /localities/:id
   * Obtiene una localidad por id.
   */
  async findOne(id: string): Promise<LocalityResponseDto> {
    const locality = await this.prisma.locality.findUnique({
      where: { id },
    });

    if (!locality) {
      throw new NotFoundException('Localidad no encontrada');
    }

    return this.toResponseDto(locality);
  }

  private toResponseDto(locality: Locality): LocalityResponseDto {
    return {
      id: locality.id,
      name: locality.name,
      createdAt: locality.createdAt,
    };
  }
}