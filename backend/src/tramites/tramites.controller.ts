import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { CrearTramiteDto } from './dto/crear-tramite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { Tramite, RolUsuario } from '@prisma/client';

@Controller('tramites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.ABOGADO, RolUsuario.ARQUITECTO)
  async create(
    @Body() createDto: CrearTramiteDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Tramite> {
    const usuarioId = user.id;
    return this.tramitesService.createTramite(createDto, usuarioId);
  }
}
