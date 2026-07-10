import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchNeighborhoodDto } from './dto/search-neighborhood.dto';
import { NeighborhoodResponseDto } from './dto/neighborhood-response.dto';

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
export class NeighborhoodsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /neighborhoods
   * Lista los barrios de forma paginada, opcionalmente filtrados por localidad.
   */
  async findAll(
    query: SearchNeighborhoodDto,
  ): Promise<PaginatedResult<NeighborhoodResponseDto>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NeighborhoodWhereInput = {
      ...(query.localityId && {
        localityId: query.localityId,
      }),
    };

    const [neighborhoods, total] = await this.prisma.$transaction([
      this.prisma.neighborhood.findMany({
        where,
        include: {
          locality: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.neighborhood.count({
        where,
      }),
    ]);

    return {
      data: neighborhoods.map((neighborhood) =>
        this.toResponseDto(neighborhood),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * GET /neighborhoods/:id
   * Obtiene un barrio por su ID, incluyendo la localidad a la que pertenece.
   */
  async findOne(id: string): Promise<NeighborhoodResponseDto> {
    const neighborhood = await this.prisma.neighborhood.findUnique({
      where: { id },
      include: {
        locality: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!neighborhood) {
      throw new NotFoundException('Barrio no encontrado');
    }

    return this.toResponseDto(neighborhood);
  }

  private toResponseDto(
    neighborhood: Prisma.NeighborhoodGetPayload<{
      include: {
        locality: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    }>,
  ): NeighborhoodResponseDto {
    return {
      id: neighborhood.id,
      name: neighborhood.name,
      locality: {
        id: neighborhood.locality.id,
        name: neighborhood.locality.name,
      },
    };
  }
}
