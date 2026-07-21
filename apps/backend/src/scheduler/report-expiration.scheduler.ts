import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportExpirationScheduler {
  private readonly logger = new Logger(ReportExpirationScheduler.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cada minuto busca reportes vencidos
   * y los oculta automáticamente.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReports() {
    const result = await this.prisma.report.updateMany({
      where: {
        visibleOnMap: true,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        visibleOnMap: false,
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `${result.count} reporte(s) expirado(s) ocultado(s) automáticamente.`,
      );
    }
  }
}
