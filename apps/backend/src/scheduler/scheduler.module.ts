import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportExpirationScheduler } from './report-expiration.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [ReportExpirationScheduler],
})
export class SchedulerModule {}
