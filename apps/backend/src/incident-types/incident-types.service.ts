import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IncidentType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentTypeDto } from './dto/create-incident-type.dto';
import { UpdateIncidentTypeDto } from './dto/update-incident-type.dto';
import { SearchIncidentTypeDto } from './dto/search-incident-type.dto';
import { ChangeIncidentTypeStatusDto } from './dto/change-incident-type-status.dto';

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
export class IncidentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ============================================================
   * CREATE
   * ============================================================
   * Crea un nuevo tipo de incidente.
   *
   * Validaciones:
   * - El código debe ser único.
   * - El código se guarda en mayúsculas.
   * - active siempre inicia en true.
   */
  async create(dto: CreateIncidentTypeDto): Promise<IncidentType> {
    const normalizedCode = dto.code.trim().toUpperCase();

    const existing = await this.prisma.incidentType.findUnique({
      where: {
        code: normalizedCode,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un tipo de incidente con el código "${normalizedCode}"`,
      );
    }

    return this.prisma.incidentType.create({
      data: {
        code: normalizedCode,
        label: dto.label.trim(),
        icon: dto.icon ?? null,
        color: dto.color ?? null,
        defaultValidityHours: dto.defaultValidityHours,
        active: true,
      },
    });
  }

  /**
   * ============================================================
   * FIND ALL
   * ============================================================
   * Lista tipos de incidente con paginación y filtro por estado.
   *
   * Si no se envía ?active=, por defecto devuelve únicamente
   * los tipos activos.
   */
  async findAll(
    query: SearchIncidentTypeDto,
  ): Promise<PaginatedResult<IncidentType>> {
    const page = query.page && query.page > 0 ? query.page : 1;

    const limit =
      query.limit && query.limit > 0 && query.limit <= 100
        ? query.limit
        : 10;

    const skip = (page - 1) * limit;

    const where: Prisma.IncidentTypeWhereInput = {
      active: query.active ?? true,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.incidentType.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          label: 'asc',
        },
      }),
      this.prisma.incidentType.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * ============================================================
   * FIND ONE
   * ============================================================
   * Obtiene un tipo de incidente por su ID.
   */
  async findOne(id: string): Promise<IncidentType> {
    const incidentType = await this.prisma.incidentType.findUnique({
      where: {
        id,
      },
    });

    if (!incidentType) {
      throw new NotFoundException(
        `Tipo de incidente con id ${id} no encontrado`,
      );
    }

    return incidentType;
  }

  /**
   * ============================================================
   * UPDATE
   * ============================================================
   * Actualiza la información del tipo de incidente.
   *
   * El código NO puede modificarse.
   */
  async update(
    id: string,
    dto: UpdateIncidentTypeDto,
  ): Promise<IncidentType> {
    const incidentType = await this.prisma.incidentType.findUnique({
      where: {
        id,
      },
    });

    if (!incidentType) {
      throw new NotFoundException(
        `Tipo de incidente con id ${id} no encontrado`,
      );
    }

    return this.prisma.incidentType.update({
      where: {
        id,
      },
      data: {
        label: dto.label.trim(),
        icon: dto.icon ?? null,
        color: dto.color ?? null,
        defaultValidityHours: dto.defaultValidityHours,
      },
    });
  }

  /**
   * ============================================================
   * CHANGE STATUS
   * ============================================================
   * Activa o desactiva un tipo de incidente.
   *
   * No permite realizar una actualización si el estado ya es el
   * mismo que se está solicitando.
   */
  async changeStatus(
    id: string,
    dto: ChangeIncidentTypeStatusDto,
  ): Promise<IncidentType> {
    const incidentType = await this.prisma.incidentType.findUnique({
      where: {
        id,
      },
    });

    if (!incidentType) {
      throw new NotFoundException(
        `Tipo de incidente con id ${id} no encontrado`,
      );
    }

    if (incidentType.active === dto.active) {
      throw new BadRequestException(
        dto.active
          ? 'El tipo de incidente ya está activo'
          : 'El tipo de incidente ya está desactivado',
      );
    }

    return this.prisma.incidentType.update({
      where: {
        id,
      },
      data: {
        active: dto.active,
      },
    });
  }
} 