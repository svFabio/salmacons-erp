import { Module } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { TramitesRepository } from './tramites.repository';
import { TramitesController } from './tramites.controller';
import { TiposTramiteController } from './tipos-tramite.controller';
import { TiposTramiteService } from './tipos-tramite.service';
import { TiposTramiteRepository } from '../repositories/tipos-tramite.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TramitesController, TiposTramiteController],
  providers: [
    TramitesService,
    TramitesRepository,
    TiposTramiteService,
    TiposTramiteRepository,
  ],
  exports: [
    TramitesService,
    TramitesRepository,
    TiposTramiteService,
    TiposTramiteRepository,
  ],
})
export class TramitesModule {}
