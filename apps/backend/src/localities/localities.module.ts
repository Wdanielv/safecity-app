import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalitiesController } from './localities.controller';
import { LocalitiesService } from './localities.service';

@Module({
  imports: [PrismaModule],
  controllers: [LocalitiesController],
  providers: [LocalitiesService],
  exports: [LocalitiesService],
})
export class LocalitiesModule {}