import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TiposTramiteService } from './tipos-tramite.service';
import { CrearTipoTramiteDto } from './dto/crear-tipo-tramite.dto';
import { ActualizarTipoTramiteDto } from './dto/actualizar-tipo-tramite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario, TipoTramite } from '@prisma/client';

@Controller('tipos-tramite')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TiposTramiteController {
  constructor(private readonly tiposTramiteService: TiposTramiteService) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.ABOGADO, RolUsuario.ARQUITECTO)
  async findAll(): Promise<TipoTramite[]> {
    return this.tiposTramiteService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.ABOGADO, RolUsuario.ARQUITECTO)
  async findById(@Param('id') id: string): Promise<TipoTramite> {
    return this.tiposTramiteService.findById(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  async create(@Body() data: CrearTipoTramiteDto): Promise<TipoTramite> {
    return this.tiposTramiteService.create(data);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() data: ActualizarTipoTramiteDto,
  ): Promise<TipoTramite> {
    return this.tiposTramiteService.update(id, data);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.tiposTramiteService.delete(id);
  }
}
