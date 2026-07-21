import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfirmationsController } from './confirmations.controller';
import { ConfirmationsService } from './confirmations.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConfirmationsController],
  providers: [ConfirmationsService],
  exports: [ConfirmationsService],
})
export class ConfirmationsModule {}
