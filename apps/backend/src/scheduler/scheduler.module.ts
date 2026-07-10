import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportExpirationScheduler } from './report-expiration.scheduler';

@Module({
  imports: [PrismaModule],
  providers: [ReportExpirationScheduler],
})
export class SchedulerModule {}