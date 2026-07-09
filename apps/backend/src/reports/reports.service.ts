import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReportStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SearchReportDto } from './dto/search-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';

const REPORT_INCLUDE = {
  incidentType: {
    select: { id: true, code: true, label: true },
  },
  locality: {
    select: { id: true, name: true },
  },
  neighborhood: {
    select: { id: true, name: true },
  },
  user: {
    select: { id: true, name: true, photoUrl: true },
  },
} satisfies Prisma.ReportInclude;

type ReportWithRelations = Prisma.ReportGetPayload<{
  include: typeof REPORT_INCLUDE;
}>;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ROLES_ALLOWED_TO_MODERATE: UserRole[] = [
  UserRole.ADMINISTRADOR,
  UserRole.MODERADOR,
];

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * POST /reports
   * Crea un reporte. status, visibleOnMap, expiresAt y userId
   * se calculan en el backend y nunca provienen del cliente.
   *
   * Validaciones:
   * - El usuario debe existir (defensa en profundidad ante un JWT con
   *   un sub que ya no corresponda a un usuario válido).
   * - El tipo de incidente debe existir y estar activo.
   * - La localidad debe existir.
   * - Si se envía barrio, debe existir y pertenecer a la localidad indicada.
   */
  async create(
    userId: string,
    dto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const incidentType = await tx.incidentType.findUnique({
        where: { id: dto.incidentTypeId },
      });

      if (!incidentType) {
        throw new NotFoundException(
          'El tipo de incidente indicado no existe',
        );
      }

      if (!incidentType.active) {
        throw new BadRequestException(
          'El tipo de incidente indicado no está activo',
        );
      }

      const locality = await tx.locality.findUnique({
        where: { id: dto.localityId },
      });

      if (!locality) {
        throw new NotFoundException('La localidad indicada no existe');
      }

      if (dto.neighborhoodId) {
        const neighborhood = await tx.neighborhood.findUnique({
          where: { id: dto.neighborhoodId },
        });

        if (!neighborhood) {
          throw new NotFoundException('El barrio indicado no existe');
        }

        if (neighborhood.localityId !== dto.localityId) {
          throw new BadRequestException(
            'El barrio no pertenece a la localidad indicada',
          );
        }
      }

      const expiresAt = this.calculateExpiresAt(
        incidentType.defaultValidityHours,
      );

      return tx.report.create({
        data: {
          userId,
          incidentTypeId: dto.incidentTypeId,
          localityId: dto.localityId,
          neighborhoodId: dto.neighborhoodId ?? null,
          latitude: dto.latitude,
          longitude: dto.longitude,
          description: dto.description ?? null,
          status: ReportStatus.PENDIENTE,
          visibleOnMap: true,
          expiresAt,
        },
        include: REPORT_INCLUDE,
      });
    });

    return this.toResponseDto(created);
  }

  /**
   * GET /reports
   * Lista reportes con filtros opcionales y paginación.
   * Solo muestra reportes visibles en el mapa (visibleOnMap = true)
   * y que no hayan expirado (expiresAt > ahora).
   */
  async findAll(
    query: SearchReportDto,
  ): Promise<PaginatedResult<ReportResponseDto>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 && query.limit <= 100
      ? query.limit
      : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {
      visibleOnMap: true,
      expiresAt: { gt: new Date() },
      ...(query.incidentTypeId && { incidentTypeId: query.incidentTypeId }),
      ...(query.localityId && { localityId: query.localityId }),
      ...(query.neighborhoodId && { neighborhoodId: query.neighborhoodId }),
      ...(query.status && { status: query.status }),
    };

    const [reports, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where,
        include: REPORT_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports.map((report) => this.toResponseDto(report)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * GET /reports/:id
   * Obtiene el detalle completo de un reporte.
   */
  async findOne(id: string): Promise<ReportResponseDto> {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: REPORT_INCLUDE,
    });

    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }

    return this.toResponseDto(report);
  }

  /**
   * PUT /reports/:id
   * Solo el propietario puede editar, y solo mientras el estado sea PENDIENTE.
   * Único campo editable: description.
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateReportDto,
  ): Promise<ReportResponseDto> {
    const report = await this.prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }

    if (report.userId !== userId) {
      throw new ForbiddenException(
        'Solo el propietario del reporte puede editarlo',
      );
    }

    if (report.status !== ReportStatus.PENDIENTE) {
      throw new BadRequestException(
        'El reporte solo puede editarse mientras su estado sea PENDIENTE',
      );
    }

    const updated = await this.prisma.report.update({
      where: { id },
      data: { description: dto.description },
      include: REPORT_INCLUDE,
    });

    return this.toResponseDto(updated);
  }

  /**
   * DELETE /reports/:id
   * Soft delete: nunca borra físicamente, solo marca visibleOnMap = false.
   * Permitido para el propietario del reporte o para ADMINISTRADOR/MODERADOR.
   * No permite ocultar un reporte que ya está oculto.
   * Si quien elimina es un moderador/administrador, se deja constancia
   * en ReportStatusHistory.
   */
  async remove(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<{ message: string }> {
    const report = await this.prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Reporte con id ${id} no encontrado`);
    }

    const isOwner = report.userId === userId;
    const isModerator = ROLES_ALLOWED_TO_MODERATE.includes(userRole);

    if (!isOwner && !isModerator) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este reporte',
      );
    }

    if (!report.visibleOnMap) {
      throw new BadRequestException('El reporte ya fue eliminado');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id },
        data: { visibleOnMap: false },
      });

      // Se deja constancia del ocultamiento cuando lo realiza un
      // moderador/administrador sobre un reporte ajeno. Si el propio
      // dueño (aunque tenga rol de moderador) elimina su reporte, no
      // se considera una acción administrativa y no genera historial.
      if (isModerator && !isOwner) {
        await tx.reportStatusHistory.create({
          data: {
            reportId: id,
            fromStatus: report.status,
            toStatus: report.status,
            changedById: userId,
            reason: 'Reporte ocultado por moderación',
          },
        });
      }
    });

    return { message: 'Reporte eliminado (oculto del mapa) correctamente' };
  }

  private calculateExpiresAt(defaultValidityHours: number): Date {
    const now = Date.now();
    const validityMs = defaultValidityHours * 60 * 60 * 1000;
    return new Date(now + validityMs);
  }

  private toResponseDto(report: ReportWithRelations): ReportResponseDto {
    return {
      id: report.id,
      description: report.description,
      latitude: Number(report.latitude),
      longitude: Number(report.longitude),
      status: report.status,
      visibleOnMap: report.visibleOnMap,
      expiresAt: report.expiresAt,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      incidentType: {
        id: report.incidentType.id,
        code: report.incidentType.code,
        label: report.incidentType.label,
      },
      locality: {
        id: report.locality.id,
        name: report.locality.name,
      },
      neighborhood: report.neighborhood
        ? { id: report.neighborhood.id, name: report.neighborhood.name }
        : null,
      user: report.user
        ? {
            id: report.user.id,
            name: report.user.name,
            photoUrl: report.user.photoUrl,
          }
        : null,
    };
  }
}