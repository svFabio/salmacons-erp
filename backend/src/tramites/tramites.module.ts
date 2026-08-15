import { Module } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { TramitesRepository } from './tramites.repository';
import { TramitesController } from './tramites.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TramitesController],
  providers: [TramitesService, TramitesRepository],
  exports: [TramitesService, TramitesRepository],
})
export class TramitesModule {}
