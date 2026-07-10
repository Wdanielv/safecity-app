import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmationResponseDto } from './dto/confirmation-response.dto';

@Injectable()
export class ConfirmationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * POST /reports/:id/confirmations
   *
   * Permite que un usuario confirme un reporte creado por otro usuario.
   *
   * Validaciones:
   * - El reporte debe existir.
   * - El reporte debe seguir visible.
   * - El reporte no debe haber expirado.
   * - El usuario no puede confirmar su propio reporte.
   * - El usuario solo puede confirmar una vez.
   */
  async create(
    reportId: string,
    userId: string,
  ): Promise<ConfirmationResponseDto> {
    const confirmation = await this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        throw new NotFoundException('Reporte no encontrado');
      }

      if (!report.visibleOnMap) {
        throw new BadRequestException(
          'El reporte ya no se encuentra disponible',
        );
      }

      if (report.expiresAt <= new Date()) {
        throw new BadRequestException(
          'El reporte ya expiró y no puede confirmarse',
        );
      }

      if (report.userId === userId) {
        throw new ForbiddenException(
          'No puedes confirmar tu propio reporte',
        );
      }

      const alreadyConfirmed =
        await tx.reportConfirmation.findUnique({
          where: {
            reportId_userId: {
              reportId,
              userId,
            },
          },
        });

      if (alreadyConfirmed) {
        throw new ConflictException(
          'Ya confirmaste este reporte',
        );
      }

      /**
       * TODO
       * Validar proximidad geográfica del usuario
       * cuando se implemente el módulo de geolocalización.
       */

      const created = await tx.reportConfirmation.create({
        data: {
          reportId,
          userId,
        },
      });

      /**
       * TODO
       * Emitir evento para recalcular la confianza
       * del reporte cuando exista ReputationModule.
       */

      return created;
    });

    return {
      reportId: confirmation.reportId,
      confirmedBy: confirmation.userId,
      confirmedAt: confirmation.createdAt,
    };
  }

  /**
   * DELETE /reports/:id/confirmations
   *
   * Elimina la confirmación realizada por el usuario.
   */
  async remove(
    reportId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const confirmation =
      await this.prisma.reportConfirmation.findUnique({
        where: {
          reportId_userId: {
            reportId,
            userId,
          },
        },
      });

    if (!confirmation) {
      throw new NotFoundException(
        'No existe una confirmación para este reporte',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.reportConfirmation.delete({
        where: {
          reportId_userId: {
            reportId,
            userId,
          },
        },
      });

      /**
       * TODO
       * Emitir evento para recalcular la confianza
       * del reporte cuando exista ReputationModule.
       */
    });

    return {
      message: 'Confirmación eliminada correctamente',
    };
  }
}