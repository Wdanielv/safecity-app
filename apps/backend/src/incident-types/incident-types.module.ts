import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IncidentTypesController } from './incident-types.controller';
import { IncidentTypesService } from './incident-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [IncidentTypesController],
  providers: [IncidentTypesService],
  exports: [IncidentTypesService],
})
export class IncidentTypesModule {}